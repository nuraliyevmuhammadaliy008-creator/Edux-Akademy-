// Tezkor tekshiruv: joriy .env bilan botga sinov xabari yuboradi va aniq xatoni chiqaradi.
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, '.env') });
const { TELEGRAM_BOT_TOKEN: TOKEN, TELEGRAM_CHAT_ID: CHAT } = process.env;
if (!TOKEN || !CHAT) { console.error('server/.env da TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID yo‘q. Avval "npm run setup" ni ishga tushiring.'); process.exit(1); }
try {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: CHAT, text: '✅ Test xabar: EduX serveri botga ulangan.' }) });
  const j = await r.json();
  if (j.ok) console.log('Muvaffaqiyatli! Xabar botga yuborildi. Telegramni tekshiring.');
  else {
    console.error('Xato:', j.description);
    if (j.error_code === 401) console.error('→ Token noto‘g‘ri yoki bekor qilingan. Yangi token oling.');
    if (j.error_code === 400 && /chat not found/i.test(j.description)) console.error('→ CHAT_ID noto‘g‘ri, yoki botga hali /start bosilmagan. "npm run setup" ni qayta ishga tushiring.');
  }
} catch {
  console.error('Internetga ulanib bo‘lmadi: api.telegram.org manziliga chiqib bo‘lmayapti (tarmoq/firewall/VPN muammosi bo‘lishi mumkin).');
}
