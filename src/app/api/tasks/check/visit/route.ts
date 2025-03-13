// app/api/tasks/check/visit/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { validateTelegramWebAppData } from '@/utils/server-checks';
import { TASK_WAIT_TIME } from '@/utils/consts';
import { calculateYieldPerHour } from '@/utils/calculations';
import { TransactionStatus, TransactionType } from '@prisma/client';

interface CheckVisitTaskRequestBody {
  initData: string;
  taskId: string;
}

export async function POST(req: Request) {
  const requestBody: CheckVisitTaskRequestBody = await req.json();
  const { initData: telegramInitData, taskId } = requestBody;

  if (!telegramInitData || !taskId) {
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

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Find the user
      const dbUser = await prisma.user.findUnique({
        where: { telegramId }
      });

      if (!dbUser) {
        throw new Error('User not found');
      }

      // Find the task
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { taskAction: true }
      });

      if (!task) {
        throw new Error('Task not found');
      }

      // Check if the task is active
      if (!task.isActive) {
        throw new Error('This task is no longer active');
      }

      // Check if the task is of action VISIT and has taskData
      if (task.taskAction.name !== 'VISIT' || !task.taskData) {
        throw new Error('Invalid task action or missing task data for this operation');
      }

      if (typeof TASK_WAIT_TIME !== 'number') {
        throw new Error('Invalid timeToWait in task data');
      }

      // Find the user's task
      const userTask = await prisma.userTask.findFirst({
        where: {
          userId: dbUser.id,
          taskId: task.id
        }
      });

      if (!userTask) {
        throw new Error('Task not started');
      }

      if (userTask.isCompleted) {
        throw new Error('Task already completed');
      }

      // Check if enough time has passed
      const taskData = task.taskData as { waitTime?: number };
      const waitTime = taskData.waitTime ? taskData.waitTime * 60000 : TASK_WAIT_TIME;
      const waitEndTime = new Date(userTask.taskStartTimestamp.getTime() + waitTime);
      if (new Date() < waitEndTime) {
        const remainingTime = Math.ceil((waitEndTime.getTime() - Date.now()) / 1000); // in seconds
        return {
          success: false,
          message: `Not enough time has passed. Please wait ${remainingTime} more seconds.`,
          remainingTime
        };
      }

      // Update the task as completed
      const updatedUserTask = await prisma.userTask.update({
        where: {
          id: userTask.id
        },
        data: {
          isCompleted: true,
          completedAt: new Date()
        }
      });

      const pointsToIncrement = task.points || 0;
      const pointsMultiplier = task.multiplier || (task.type === 'DAILY' ? 2 : 1.5);
      const userYieldPerHour = dbUser.yieldPerHour || 0;
      const userBonusYield = dbUser.bonusYieldPerHour || 0;
      const totalMultiplier = calculateYieldPerHour(userBonusYield, userYieldPerHour) * pointsMultiplier;
      const points = Math.round(pointsToIncrement + totalMultiplier);

      // Add points to user's balance
      const updatedUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          points: { increment: points },
          pointsBalance: { increment: points },
          totalStars: { increment: task.rewardStars || 0 },
          earnedStars: { increment: task.rewardStars || 0 }
        }
      });

      await prisma.transaction.create({
        data: {
          userId: dbUser.id,
          sourceId: updatedUserTask.id,
          amount: task.rewardStars || 0,
          type: TransactionType.EARNED,
          status: TransactionStatus.COMPLETED,
          description: `Task reward: ${task.title}`
        }
      });

      return {
        success: true,
        message: 'Task completed successfully',
        isCompleted: updatedUserTask.isCompleted,
        completedAt: updatedUserTask.completedAt,
        points,
        totalStars: updatedUser.totalStars,
        earnedStars: updatedUser.earnedStars
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking visit task:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check visit task'
      },
      { status: 500 }
    );
  }
}
