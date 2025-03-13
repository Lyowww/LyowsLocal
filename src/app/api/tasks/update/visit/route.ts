// app/api/tasks/update/visit/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { validateTelegramWebAppData } from '@/utils/server-checks';
import { TASK_DAILY_RESET_TIME } from '@/utils/consts';

interface UpdateTaskRequestBody {
  initData: string;
  taskId: string;
}

export async function POST(req: Request) {
  const requestBody: UpdateTaskRequestBody = await req.json();
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

      // Check if the task is of action VISIT
      if (task.taskAction.name !== 'VISIT') {
        throw new Error('Invalid task action for this operation');
      }

      // Check if the task is DAILY
      if (task.type === 'DAILY') {
        // Get the current date and time in UTC
        const now = new Date();
        const resetTime = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), TASK_DAILY_RESET_TIME, 0, 0)
        );

        // Check if a daily task has already been created for today
        const userTaskToday = await prisma.userTask.findFirst({
          where: {
            userId: dbUser.id,
            taskId: task.id,
            completedAt: {
              gte: resetTime, // After 10 AM UTC today
              lt: new Date(resetTime.getTime() + 24 * 60 * 60 * 1000) // Before 10 AM UTC tomorrow
            }
          }
        });

        if (userTaskToday) {
          throw new Error('Daily task already started');
        }

        // Create a new UserTask entry for daily task
        const userTask = await prisma.userTask.create({
          data: {
            userId: dbUser.id,
            taskId: task.id,
            taskStartTimestamp: new Date(),
            isCompleted: false
          }
        });

        return {
          success: true,
          message: 'Daily task started successfully.',
          taskStartTimestamp: userTask.taskStartTimestamp
        };
      }

      // For VISIT tasks, check if the user has already started this task
      const existingUserTask = await prisma.userTask.findFirst({
        where: {
          userId: dbUser.id,
          taskId: task.id
        }
      });

      if (existingUserTask) {
        throw new Error('Task already started');
      }

      // Create a new UserTask entry for VISIT task
      const userTask = await prisma.userTask.create({
        data: {
          userId: dbUser.id,
          taskId: task.id,
          taskStartTimestamp: new Date(),
          isCompleted: false
        }
      });

      return {
        success: true,
        message: 'Task started successfully',
        taskStartTimestamp: userTask.taskStartTimestamp
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update task' },
      { status: 500 }
    );
  }
}
