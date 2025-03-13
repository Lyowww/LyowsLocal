import { NextRequest, NextResponse } from "next/server";
import { validateTelegramWebAppData } from "@/utils/server-checks";
import prisma from "@/utils/prisma";
import cloudinary from "@/utils/cloudinary";

// Assuming you have the Telegram Bot token
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_BOT_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

export const POST = async (req: NextRequest, res: NextResponse) => {
  const formData: FormData = await req.formData();
  const telegramInitData = formData.get("initData") as string;
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
    const user = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the file from the form data
    const file = formData.get("file") as File;

    // Check if a file is received
    if (!file) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 },
      );
    }

    if (file.type !== "image/png") {
      return NextResponse.json(
        {
          error: "Unsupported file type. Only image/png is allowed.",
        },
        { status: 400 },
      );
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File size exceeds 5MB.",
        },
        { status: 400 },
      );
    }

    const buffer = await file.arrayBuffer();
    const base64File = Buffer.from(buffer).toString("base64");
    const uploadResponse = await cloudinary.uploader.upload(
      `data:${file.type};base64,${base64File}`,
    );

    return NextResponse.json({ url: uploadResponse.url });
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json(
      { error: "Failed to upload image to Telegram" },
      { status: 500 },
    );
  }
};
