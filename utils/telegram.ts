// utils/telegram.ts

import { TELEGRAM_BOT_AUTO_REPLY } from './consts';
import { InvoiceItem } from './types';

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;

async function createInvoiceLink(item: InvoiceItem): Promise<any> {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/createInvoiceLink`;

  const formdata = new FormData();
  formdata.append('title', item.name);
  formdata.append('description', item.description);
  formdata.append('payload', item.payload || '{}');
  formdata.append('provider_token', item.provider_token || '');
  formdata.append('currency', item.currency || 'XTR');
  formdata.append('prices', JSON.stringify(item.prices));

  const requestOptions = {
    method: 'POST',
    body: formdata
  };

  const response = await fetch(url, requestOptions);
  const data = await response.json();
  console.log('Invoice data:', data);

  if (!data.ok) {
    return null;
  }

  return data.result; // Invoice link
}

async function sendMessageToUser(chatId: number, text?: string) {
  const formdata = new FormData();
  formdata.append('chat_id', chatId.toString());
  formdata.append('text', text || TELEGRAM_BOT_AUTO_REPLY);
  formdata.append('parse_mode', 'MarkdownV2');

  const requestOptions: RequestInit = {
    method: 'POST',
    body: formdata,
    redirect: 'follow' as RequestRedirect
  };

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, requestOptions);

  const data = await response.json();
  console.log('Send message:', data);
}

export { createInvoiceLink, sendMessageToUser };
