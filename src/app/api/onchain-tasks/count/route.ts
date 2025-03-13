// app/api/onchain-tasks/count/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { validateTelegramWebAppData } from "@/utils/server-checks";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const telegramInitData = url.searchParams.get("initData");

  if (!telegramInitData) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { validatedData, user } = validateTelegramWebAppData(telegramInitData);

  if (!validatedData) {
    return NextResponse.json(
      { error: "Invalid Telegram data" },
      { status: 403 },
    );
  }

  const telegramId = user.id?.toString();

  if (!telegramId) {
    return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
  }

  try {
    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const onchainTasks = await prisma.onchainTask.findMany();

    // Fetch user's completions
    const onchainTaskCompletions = await prisma.onchainTaskCompletion.findMany({
      where: {
        userId: user.id,
      },
      include: {
        onchainTask: true,
      },
    });

    let count = 0;

    for (let onchainTaskCompletion of onchainTaskCompletions) {
      for (let i = 0; i < onchainTasks.length; i++) {
        if (onchainTaskCompletion.onchainTaskId === onchainTasks[i].id) {
          count += i * 2 + 1;
        }
      }
    }

    console.log("count:", count);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Fetch onchain tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch onchain tasks" },
      { status: 500 },
    );
  }
}
