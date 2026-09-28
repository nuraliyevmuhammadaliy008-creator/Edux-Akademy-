// Interaktiv sozlash: token so'raydi, chat ID ni o'zi topadi, server/.env yozadi va test xabar yuboradi.
import readline from 'node:readline/promises';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../server/.env');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const api = async (token, method, body) => {
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, body && { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return await r.json();
  } catch {
    return { ok: false, network: true };
  }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log('\nEduX Telegram sozlash\n');
const token = (await rl.question('BotFather bergan tokenni kiriting: ')).trim();
const me = await api(token, 'getMe');
if (!me?.ok) {
  if (me?.network) {
    console.error('\nInternetga ulanib bo‘lmadi: api.telegram.org manziliga chiqib bo‘lmayapti.');
    console.error('Bu token bilan bog‘liq emas — kompyuter/tarmoq Telegram serveriga ulana olmayapti.');
    console.error('Tekshiring:');
    console.error('  1) Boshqa internet (masalan telefon hotspot) bilan urinib ko‘ring.');
    console.error('  2) Antivirus, korporativ firewall yoki VPN o‘chirib/yoqib ko‘ring.');
    console.error('  3. curl.exe "https://api.telegram.org" ni terminalda ishga tushirib tekshiring.');
  } else {
    console.error('\nToken noto‘g‘ri:', me?.description || 'Bot topilmadi.');
    console.error('BotFather bergan tokenni to‘liq va aynan nusxalab yopishtiring (ikki nuqta bilan birga).');
  }
  process.exit(1);
}
console.log(`\nBot topildi: @${me.result.username}`);
console.log(`Endi Telegramda @${me.result.username} ga kiring va /start bosing (yoki botni guruhga qo‘shib, guruhda xabar yozing).`);
console.log('Kutilmoqda (2 daqiqagacha)...');

let chat = null;
for (let i = 0; i < 40 && !chat; i++) {
  const j = await api(token, 'getUpdates');
  const u = (j.result || []).reverse().find((x) => (x.message || x.channel_post)?.chat);
  chat = (u?.message || u?.channel_post)?.chat || null;
  if (!chat) await sleep(3000);
}
if (!chat) { console.error('Xabar topilmadi. Botga /start yozib, qayta urinib ko‘ring.'); process.exit(1); }

fs.writeFileSync(envPath, `TELEGRAM_BOT_TOKEN=${token}\nTELEGRAM_CHAT_ID=${chat.id}\nPORT=3001\n`);
const t = await api(token, 'sendMessage', { chat_id: chat.id, text: '✅ EduX sayti Telegram botga ulandi. Arizalar shu yerga keladi.' });
console.log(t.ok ? `\nTayyor! ${chat.title || chat.first_name} chatiga test xabar yuborildi. Sozlamalar server/.env ga saqlandi.` : `\nChat ID topildi (${chat.id}), lekin xabar yuborilmadi: ${t.description}`);
rl.close();
