// app/api/upgrade/skill/yield-per-hour/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { validateTelegramWebAppData } from '@/utils/server-checks';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MAX_YIELD_HOURS } from '@/utils/consts';

interface YieldPerHourRequestBody {
  initData: string;
  requestType: 'startup' | 'periodic';
}

interface YieldResult {
  success: boolean;
  message: string;
  points: number;
  lastTimestamp: Date;
  earnedPoints: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 100; // milliseconds
const MIN_UPDATE_INTERVAL = 60000; // 1 minute in milliseconds

class YieldCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'YieldCalculationError';
  }
}

const calculateTotalYieldPerHour = (
  baseYield: number,
  bonusYield: number,
  rewardBoostEndTime: Date | null,
  rewardBoostMultiplier: number,
  currentTime: Date
): number => {
  let totalMultiplier = 1;

  if (bonusYield > 0) {
    totalMultiplier += bonusYield / 100;
  }

  if (rewardBoostEndTime && currentTime < rewardBoostEndTime) {
    totalMultiplier += rewardBoostMultiplier;
  }

  return baseYield * totalMultiplier;
};

const calculateMaxOfflineDuration = (
  bonusOfflineYieldDuration: number,
  activeOfflineBoostEndTime: Date | null,
  activeOfflineBoostDuration: number,
  currentTime: Date
): number => {
  const bonusHours = bonusOfflineYieldDuration / 60;

  if (activeOfflineBoostEndTime && currentTime < activeOfflineBoostEndTime) {
    return Math.max(activeOfflineBoostDuration, MAX_YIELD_HOURS + bonusHours);
  }

  return MAX_YIELD_HOURS + bonusHours;
};

const calculatePoints = (
  lastYieldTimestamp: Date,
  currentTime: Date,
  upgradeYieldPerHour: number,
  bonusYieldPerHour: number,
  bonusOfflineYieldDuration: number,
  activeOfflineBoostEndTime: Date | null,
  activeOfflineBoostDuration: number,
  activeRewardBoostEndTime: Date | null,
  activeRewardBoostMultiplier: number,
  isStartup: boolean
): number => {
  const millisecondsElapsed = currentTime.getTime() - lastYieldTimestamp.getTime();

  if (millisecondsElapsed < MIN_UPDATE_INTERVAL) {
    throw new YieldCalculationError('At least 1 minute must pass between updates');
  }

  const hoursElapsed = millisecondsElapsed / 3600000;

  if (!isStartup) {
    // For periodic updates, calculate points based on actual time passed
    return Math.floor(
      hoursElapsed *
        calculateTotalYieldPerHour(
          upgradeYieldPerHour,
          bonusYieldPerHour,
          activeRewardBoostEndTime,
          activeRewardBoostMultiplier,
          currentTime
        )
    );
  }

  // Startup calculation with offline duration limits
  const maxDuration = calculateMaxOfflineDuration(
    bonusOfflineYieldDuration,
    activeOfflineBoostEndTime,
    activeOfflineBoostDuration,
    currentTime
  );
  const effectiveHours = Math.min(hoursElapsed, maxDuration);

  let totalPoints = 0;
  let remainingHours = effectiveHours;

  if (
    activeRewardBoostEndTime &&
    activeRewardBoostEndTime > lastYieldTimestamp &&
    activeRewardBoostEndTime <= currentTime
  ) {
    const boostedHours = Math.min(
      (activeRewardBoostEndTime.getTime() - lastYieldTimestamp.getTime()) / 3600000,
      remainingHours
    );

    totalPoints +=
      boostedHours *
      calculateTotalYieldPerHour(
        upgradeYieldPerHour,
        bonusYieldPerHour,
        activeRewardBoostEndTime,
        activeRewardBoostMultiplier,
        activeRewardBoostEndTime
      );
    remainingHours -= boostedHours;
  }

  if (remainingHours > 0) {
    totalPoints +=
      remainingHours *
      calculateTotalYieldPerHour(
        upgradeYieldPerHour,
        bonusYieldPerHour,
        activeRewardBoostEndTime,
        activeRewardBoostMultiplier,
        currentTime
      );
  }

  return Math.floor(totalPoints);
};

async function processYield(telegramId: string, requestType: 'startup' | 'periodic'): Promise<YieldResult> {
  const currentTime = new Date();

  return await prisma.$transaction(async (prisma) => {
    const dbUser = await prisma.user.findUnique({
      where: { telegramId }
    });

    if (!dbUser) {
      throw new Error('User not found');
    }

    const pointsToAdd = calculatePoints(
      dbUser.lastUpgradeYieldTimestamp,
      currentTime,
      dbUser.yieldPerHour,
      dbUser.bonusYieldPerHour,
      dbUser.bonusOfflineYieldDuration,
      dbUser.activeOfflineBoostEndTime,
      dbUser.activeOfflineBoostDuration || 0,
      dbUser.activeRewardBoostEndTime,
      dbUser.activeRewardBoostMultiplier || 0,
      requestType === 'startup'
    );

    const updatedUser = await prisma.user.update({
      where: { telegramId },
      data: {
        points: { increment: pointsToAdd },
        pointsBalance: { increment: pointsToAdd },
        lastUpgradeYieldTimestamp: currentTime
      }
    });

    return {
      success: true,
      message: `${requestType === 'startup' ? 'Offline' : 'Periodic'} yield added successfully`,
      points: updatedUser.points,
      lastTimestamp: updatedUser.lastUpgradeYieldTimestamp,
      earnedPoints: pointsToAdd
    };
  });
}

export async function POST(req: Request) {
  try {
    const { initData: telegramInitData, requestType }: YieldPerHourRequestBody = await req.json();

    if (!telegramInitData) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { validatedData, user } = validateTelegramWebAppData(telegramInitData);
    if (!validatedData) {
      return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 403 });
    }

    const telegramId = user.id?.toString();
    if (!telegramId) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const result = await processYield(telegramId, requestType);
        return NextResponse.json(result);
      } catch (error) {
        if (error instanceof YieldCalculationError) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2034') {
          retries++;
          if (retries >= MAX_RETRIES) {
            console.error('Max retries reached for user:', telegramId);
            return NextResponse.json({ error: 'Failed to update user data after multiple attempts' }, { status: 500 });
          }
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retries)));
          continue;
        }

        console.error('Error processing yield:', error);
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Failed to process yield' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: 'Failed to process yield after max retries' }, { status: 500 });
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
  }
}
