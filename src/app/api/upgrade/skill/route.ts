// app/api/upgrade/skill/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { validateTelegramWebAppData } from '@/utils/server-checks';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  calculateLevelIndex,
  calculateSkillUpgradeBenefit,
  calculateSkillUpgradeCost,
  calculateSkillUpgradeTime
} from '@/utils/game-mechanics';
import { LEVELS } from '@/utils/consts';
import { calculateYieldPerHour } from '@/utils/calculations';

interface UpgradeSkillRequestBody {
  initData: string;
  upgradeId: string;
}

interface UpgradeResult {
  success: boolean;
  message: string;
  updatedUserUpgrade: any;
  updatedUser: any;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 100; // milliseconds

export async function POST(req: Request) {
  const requestBody: UpgradeSkillRequestBody = await req.json();
  const { initData: telegramInitData, upgradeId } = requestBody;
  console.log('REQ payload =>', upgradeId);

  if (!telegramInitData || !upgradeId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { validatedData, user: telegramUser } = validateTelegramWebAppData(telegramInitData);
  if (!validatedData) {
    return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 403 });
  }

  const telegramId = telegramUser.id?.toString();
  if (!telegramId) {
    return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
  }

  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const result = await prisma.$transaction<UpgradeResult | null>(async (prisma) => {
        const dbUser = await prisma.user.findUnique({
          where: { telegramId },
          include: {
            referredBy: true,
            userUpgrades: {
              where: { upgradeId }
            }
          }
        });

        if (!dbUser) {
          throw new Error('User not found');
        }

        const userUpgrade = dbUser.userUpgrades[0];

        if (userUpgrade?.cooldownEndsAt && userUpgrade.cooldownEndsAt > new Date()) {
          throw new Error('Upgrade is in cooldown');
        }

        const currentLevel = userUpgrade?.level ?? 0;
        const upgrade = await prisma.upgrade.findUnique({ where: { id: upgradeId } });

        if (!upgrade) {
          throw new Error('Upgrade not found');
        }

        const upgradeCost = calculateSkillUpgradeCost(currentLevel, upgrade.baseCost);
        const nextUpgradePoints = calculateSkillUpgradeBenefit(currentLevel, upgrade.basePoints);

        if (dbUser.points < upgradeCost || dbUser.pointsBalance < upgradeCost) {
          throw new Error('Insufficient points for upgrade');
        }

        const cooldownTime = calculateSkillUpgradeTime(currentLevel);
        const cooldownEndsAt = new Date(Date.now() + cooldownTime * 1000);
        const newYield = calculateYieldPerHour(dbUser.bonusYieldPerHour ?? 0, dbUser.yieldPerHour + nextUpgradePoints);
        const oldYield = calculateYieldPerHour(dbUser.bonusYieldPerHour ?? 0, dbUser.yieldPerHour);
        const newLevelIndex = calculateLevelIndex(newYield);
        const oldLevelIndex = calculateLevelIndex(oldYield);

        const isPremium = telegramUser?.is_premium || false;

        // Calculate additional referral points if user leveled up
        let additionalReferralPoints = 0;
        if (newLevelIndex > oldLevelIndex) {
          for (let i = oldLevelIndex + 1; i <= newLevelIndex; i++) {
            additionalReferralPoints += isPremium ? LEVELS[i].friendBonusPremium : LEVELS[i].friendBonus;
          }
        }

        const updatedUserUpgrade = await prisma.userUpgrade.upsert({
          where: { userId_upgradeId: { userId: dbUser.id, upgradeId } },
          update: {
            level: currentLevel + 1,
            acquiredAt: new Date(),
            cooldownEndsAt
          },
          create: {
            userId: dbUser.id,
            upgradeId,
            level: 1,
            acquiredAt: new Date(),
            cooldownEndsAt: cooldownEndsAt
          }
        });

        // Update user's hourlyProfit
        const updatedUser = await prisma.user.update({
          where: {
            telegramId
          },
          data: {
            points: { decrement: upgradeCost },
            pointsBalance: { decrement: upgradeCost },
            yieldPerHour: { increment: nextUpgradePoints },
            referralPointsEarned: { increment: additionalReferralPoints }
          }
        });

        // Update referrer's points if user leveled up
        if (additionalReferralPoints > 0 && dbUser.referredBy) {
          await prisma.user.update({
            where: { id: dbUser.referredBy.id },
            data: {
              points: { increment: additionalReferralPoints },
              pointsBalance: { increment: additionalReferralPoints }
            }
          });
        }

        return {
          success: true,
          message: 'Skill Upgrade successful',
          updatedUserUpgrade,
          updatedUser,
          upgradeCost,
          upgradeYield: nextUpgradePoints
        };
      });

      if (result === null) {
        // User not found during update, possibly due to concurrent modification
        retries++;
        if (retries >= MAX_RETRIES) {
          console.error('Max retries reached for user:', telegramId);
          return NextResponse.json({ error: 'Failed to update user data after multiple attempts' }, { status: 500 });
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retries))); // Exponential backoff
        continue; // Try again
      }

      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      } else if (error instanceof PrismaClientKnownRequestError && error.code === 'P2034') {
        // Optimistic locking failed, retry
        retries++;
        if (retries >= MAX_RETRIES) {
          console.error('Max retries reached for user:', telegramId);
          return NextResponse.json({ error: 'Failed to update user data after multiple attempts' }, { status: 500 });
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retries))); // Exponential backoff
      } else {
        console.error('Error upgrading skill:', error);
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Failed to upgrade skill' },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ error: 'Failed to upgrade skill after max retries' }, { status: 500 });
}

export async function GET() {
  const upgrades = await prisma.upgrade.findMany();
  return NextResponse.json({ upgrades });
}
