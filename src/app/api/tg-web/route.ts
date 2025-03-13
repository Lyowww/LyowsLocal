// app/api/tg-web/route.ts

import { TELEGRAM_BOT_AUTO_REPLY } from '@/utils/consts';
import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.BOT_TOKEN;

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Webhook is working' });
}

export async function POST(req: Request) {
  console.log('WEBHOOK CALL!!!');

  const body = await req.json();
  console.log('Request body:', body);

  if (!BOT_TOKEN) {
    throw new Error('Telegram bot token is missing');
  }

  try {
    if (!body.update_id) {
      return NextResponse.json({ error: 'Invalid update format' }, { status: 400 });
    }

    // Handle updates
    switch (true) {
      case !!body.pre_checkout_query:
        await handlePreCheckoutQuery(body.pre_checkout_query);
        break;
      case !!body.message:
        await handleMessage(body.message);
        break;
      default:
        return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

async function handlePreCheckoutQuery(preCheckoutQuery: any) {
  const formdata = new FormData();
  formdata.append('pre_checkout_query_id', preCheckoutQuery.id);
  formdata.append('ok', 'true');

  const requestOptions: RequestInit = {
    method: 'POST',
    body: formdata,
    redirect: 'follow' as RequestRedirect
  };

  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`, requestOptions);

  const data = await response.json();
  console.log('Answer pre checkout query:', data);
}

async function handleMessage(message: any) {
  if (message.text) {
    await sendMessageToUser(message.chat.id);
  } else {
    console.log('Unhandled message:', message.text);
  }
}

export async function sendMessageToUser(chatId: number, text?: string) {
  const formdata = new FormData();
  formdata.append('chat_id', chatId.toString());
  formdata.append('text', text || TELEGRAM_BOT_AUTO_REPLY);
  formdata.append('parse_mode', 'MarkdownV2');

  const requestOptions: RequestInit = {
    method: 'POST',
    body: formdata,
    redirect: 'follow' as RequestRedirect
  };

  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, requestOptions);

  const data = await response.json();
  console.log('Send message:', data);
}
