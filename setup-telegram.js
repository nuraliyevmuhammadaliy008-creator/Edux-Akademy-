// Ishlatish: botga Telegramda /start yozing, so'ng: npm run telegram:setup
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) { console.error('server/.env ichida TELEGRAM_BOT_TOKEN yo‘q.'); process.exit(1); }
const j = await (await fetch(`https://api.telegram.org/bot${token}/getUpdates`)).json();
if (!j.ok) { console.error('Token xato:', j.description); process.exit(1); }
const chats = new Map();
for (const u of j.result) { const c = (u.message || u.channel_post || u.my_chat_member)?.chat; if (c) chats.set(c.id, c.title || c.first_name || c.username); }
if (!chats.size) console.log('Chat topilmadi. Botga (yoki guruhga) xabar yozing va qayta ishga tushiring.');
for (const [id, name] of chats) console.log(`TELEGRAM_CHAT_ID=${id}   (${name})`);
