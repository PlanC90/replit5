import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import TelegramBot from 'node-telegram-bot-api';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Store user mappings
const userMappings = new Map();

// Telegram Bot setup with error handling
let bot = null;
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.warn('Warning: TELEGRAM_BOT_TOKEN not provided. Bot features will be disabled.');
} else {
  try {
    bot = new TelegramBot(token, { polling: true });
    console.log('Telegram bot initialized successfully');
    
    // Handle Telegram messages
    bot.on('message', async (msg) => {
      try {
        const chatId = msg.chat.id;
        const username = msg.from.username;

        if (username) {
          userMappings.set(chatId.toString(), '@' + username);
          await bot.sendPhoto(chatId, 'https://memex.planc.space/images/gorseltg.jpg', {
            caption: `Your Telegram username (@${username})\nWelcome🤝\n\n` +
              `This bot was developed by MemeX ARMY to\n` +
              `enable easy buying and selling of Memex Token\n` +
              `via Telegram. 🚀\n\n` +
              `💎 Be cautious while trading! 💎\n` +
              `✅ Unmatched transfer fees allow seamless trading!\n` +
              `❌ Zero commission ensures you maximize your profits!\n` +
              `💰 Enjoy free and effortless trading with MemeX! 💰`,
            reply_markup: {
              inline_keyboard: [
                [{ text: '📊Trade P2P', web_app: { url: 'https://memexarmy.replit.app/' } }]
              ]
            }
          });
        } else {
          await bot.sendMessage(chatId, 'Please set a username in your Telegram settings first.');
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    // Handle polling errors
    bot.on('polling_error', (error) => {
      if (error.code === 'EFATAL' && error.message.includes('Bot Token not provided')) {
        console.warn('Bot token not provided or invalid. Bot features will be disabled.');
        bot = null;
      } else {
        console.error('Telegram bot polling error:', error);
      }
    });
  } catch (error) {
    console.error('Failed to initialize Telegram bot:', error);
    bot = null;
  }
}

async function startServer() {
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);
  
  app.use(express.static('public'));
  app.use(bodyParser.json());

  // API Endpoints
  app.get('/api/telegram-username/:chatId', async (req, res) => {
    if (!bot) {
      return res.status(503).json({ 
        error: 'Telegram bot service unavailable',
        username: '@johndoe' // Provide fallback username
      });
    }

    const { chatId } = req.params;
    const username = userMappings.get(chatId);

    if (username) {
      res.json({ username });
    } else {
      // Try to get username directly from Telegram
      try {
        const chat = await bot.getChat(chatId);
        if (chat.username) {
          const username = '@' + chat.username;
          userMappings.set(chatId, username);
          res.json({ username });
        } else {
          res.json({ username: '@johndoe' });
        }
      } catch (error) {
        console.error('Error getting chat:', error);
        res.json({ username: '@johndoe' });
      }
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      botActive: !!bot,
      timestamp: new Date().toISOString()
    });
  });

  // Serve index.html for all routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Bot status: ${bot ? 'Active' : 'Disabled'}`);
  });
}

startServer();
