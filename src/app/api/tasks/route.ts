// app/api/tasks/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { validateTelegramWebAppData } from '@/utils/server-checks';
import { TASK_DAILY_RESET_TIME } from '@/utils/consts';

const AVAILABLE_IMAGES = ['youtube', 'telegram', 'twitter', 'friends'];

async function getPartnerImage(imageName: string): Promise<string | null> {
  try {
    const partner = await prisma.partner.findFirst({
      where: {
        name: {
          contains: imageName,
          mode: 'insensitive'
        },
        isActive: true
      }
    });

    return partner ? partner.image : null;
  } catch (error) {
    console.error('Error fetching partner data:', error);
    return null;
  }
}

async function processTaskData(task: any, userTask: any | null, resetTime: Date) {
  let isCompleted = userTask?.isCompleted || false;
  let completedAt = userTask?.completedAt || null;

  // Handle daily task reset logic
  if (task.type === 'DAILY' && userTask?.completedAt) {
    const completionDate = new Date(userTask.completedAt);
    if (completionDate < resetTime) {
      isCompleted = false;
      completedAt = null;
    }
  }

  // Process image
  let taskImage = task.image;

  if (!AVAILABLE_IMAGES.includes(task.image)) {
    const partnerImage = await getPartnerImage(task.image);
    if (partnerImage) {
      taskImage = partnerImage;
    }
  }

  return {
    ...task,
    partnerImage: taskImage,
    taskStartTimestamp: userTask?.taskStartTimestamp || null,
    isCompleted,
    completedAt
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const telegramInitData = url.searchParams.get('initData');

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

  try {
    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { telegramId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch only active tasks
    const activeTasks = await prisma.task.findMany({
      where: { isActive: true, isDeleted: false },
      include: { taskAction: true }
    });

    // Fetch valid UserTask entries for this user, only for active tasks
    const validUserTasks = await prisma.userTask.findMany({
      where: {
        userId: user.id,
        task: {
          isNot: undefined,
          isActive: true
        }
      },
      include: {
        task: true
      }
    });

    // Get current date and reset time
    const now = new Date();
    const resetTime = new Date(now);
    resetTime.setUTCHours(TASK_DAILY_RESET_TIME, 0, 0, 0);

    // If current time is before reset time, set reset time to previous day
    if (now < resetTime) {
      resetTime.setDate(resetTime.getDate() - 1);
    }

    // Process active tasks
    const tasksData = await Promise.all(
      activeTasks.map((task) => {
        const userTask = validUserTasks.findLast((ut) => ut.taskId === task.id);
        return processTaskData(task, userTask, resetTime);
      })
    );

    // Process completed tasks
    const completedTasks = await Promise.all(
      validUserTasks
        .filter((ut) => {
          if (ut.isCompleted) {
            if (ut.task.type === 'DAILY' && ut.completedAt && ut.isCompleted) {
              const completionDate = new Date(ut.completedAt);
              return completionDate >= resetTime;
            }
            return true;
          }
        })
        .map(async (ut) => {
          const processedTask = await processTaskData(ut.task, ut, resetTime);
          return {
            ...ut,
            title: processedTask.title,
            description: processedTask.description,
            points: processedTask.points,
            type: processedTask.type,
            image: processedTask.image,
            partnerImage: processedTask.partnerImage,
            callToAction: processedTask.callToAction,
            taskData: processedTask.taskData,
            isActive: processedTask.isActive,
            taskActionId: processedTask.taskActionId
          };
        })
    );

    return NextResponse.json({
      tasks: tasksData,
      completedTasks
    });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch user tasks' }, { status: 500 });
  }
}
