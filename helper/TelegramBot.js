const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  const BOT_TOKEN = "8279159750:AAF8aHh3P2BdpvUu9P76o34wilwTcTSgzTs";

  // ✅ Webhook mode (polling বন্ধ)
  const bot = new TelegramBot(BOT_TOKEN, { polling: false });

  // ✅ Telegram Webhook route
  app.post('/telegram-webhook', (req, res) => {
    console.log("📩 Telegram webhook hit!");
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });

  // ✅ Command: /start
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `👋 হ্যালো ${msg.from.first_name}! Bot চলছে ✅`);
  });

  // ✅ Command: /backup
  bot.onText(/\/backup/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "📦 Backup শুরু হয়েছে...");

    // ফাইল তৈরি করে পাঠানো
    const filePath = path.join(__dirname, 'backup.txt');
    fs.writeFileSync(filePath, "Sample database backup data...");
    await bot.sendDocument(chatId, filePath);
    fs.unlinkSync(filePath);
  });

  // ✅ Webhook সেট করা (HTTPS URL)
  const webhookURL = "https://ngag-bd.onrender.com/telegram-webhook";
  bot.setWebHook(webhookURL)
    .then(() => console.log("✅ Telegram Webhook set to:", webhookURL))
    .catch(err => console.error("❌ Webhook set failed:", err.message));

  return bot;
};