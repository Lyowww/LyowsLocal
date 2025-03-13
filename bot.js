import TelegramBot from 'node-telegram-bot-api';

// Retrieve the bot token from .env
const botToken = process.env.BOT_TOKEN;

const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome! I am your bot.');
});

bot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'The bot is running fine!');
});
