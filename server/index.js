import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, '.env') });
dotenv.config({ path: path.join(here, '../.env') });

const app = express();
const { TELEGRAM_BOT_TOKEN: TOKEN, TELEGRAM_CHAT_ID: CHAT, CLIENT_ORIGIN, PORT = 3001 } = process.env;
const COURSES = ['Mobilografiya + Content Marketing'];
const SERVICES = ['Content Marketing', 'Mobileography', 'Ikkalasi'];

app.disable('x-powered-by');
app.use(cors({ origin: CLIENT_ORIGIN || false }));
app.use(express.json({ limit: '10kb' }));
app.use('/api', rateLimit({ windowMs: 10 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Juda ko‘p urinish. Iltimos, birozdan so‘ng qayta urinib ko‘ring.' } }));

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, max);
const phoneOk = (p) => { const d = p.replace(/\D/g, ''); return d.length === 12 && d.startsWith('998'); };
const fmtPhone = (p) => { const d = p.replace(/\D/g, '').slice(3); return `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`; };
const stamp = () => new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

const builders = {
  course(b) {
    const f = { name: clean(b.name, 80), phone: clean(b.phone, 20), course: clean(b.course, 60), message: clean(b.message, 500) };
    if (f.name.length < 2) return { error: 'Ismingizni kiriting.' };
    if (!phoneOk(f.phone)) return { error: 'Telefon raqamni +998 XX XXX XX XX formatida kiriting.' };
    f.phone = fmtPhone(f.phone);
    if (!COURSES.includes(f.course)) return { error: 'Kursni tanlang.' };
    return { text: `🔔 YANGI KURS ARIZASI\n\n👤 Ism: ${f.name}\n\n📞 Telefon: ${f.phone}\n\n📚 Kurs: ${f.course}\n\n💬 Izoh: ${f.message || '—'}\n\n🌐 Manba: EduX Website\n\n🕐 Vaqt: ${stamp()}` };
  },
  project(b) {
    const f = { name: clean(b.name, 80), phone: clean(b.phone, 20), brand: clean(b.brand, 100), service: clean(b.service, 40), message: clean(b.message, 1000) };
    if (f.name.length < 2) return { error: 'Ismingizni kiriting.' };
    if (!phoneOk(f.phone)) return { error: 'Telefon raqamni +998 XX XXX XX XX formatida kiriting.' };
    f.phone = fmtPhone(f.phone);
    if (!f.brand) return { error: 'Brend yoki kompaniya nomini kiriting.' };
    if (!SERVICES.includes(f.service)) return { error: 'Xizmatni tanlang.' };
    return { text: `🔔 YANGI PROJECT SO‘ROVI\n\n👤 Ism: ${f.name}\n📞 Telefon: ${f.phone}\n🏢 Brend: ${f.brand}\n🛠 Xizmat: ${f.service}\n💬 Project: ${f.message || '—'}\n\n🌐 Manba: EduX Website\n🕐 Vaqt: ${stamp()}` };
  },
};

async function sendTelegram(text) {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT, text }), signal: AbortSignal.timeout(10000),
  });
  if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(`Telegram ${r.status}: ${j.description || 'noma’lum xato'}`); }
}

const handle = (kind) => async (req, res) => {
  const out = builders[kind](req.body || {});
  if (out.error) return res.status(400).json({ error: out.error });
  if (!TOKEN || !CHAT) { console.error('Telegram env vars missing'); return res.status(500).json({ error: 'Server sozlanmagan. Keyinroq urinib ko‘ring.' }); }
  try { await sendTelegram(out.text); res.json({ ok: true }); }
  catch (e) { console.error(e.message); res.status(502).json({ error: 'Arizani yuborib bo‘lmadi. Iltimos, qayta urinib ko‘ring.' }); }
};
app.get('/api/health', (_q, res) => res.json({ ok: true, telegramConfigured: Boolean(TOKEN && CHAT) }));
app.post('/api/applications', handle('course'));
app.post('/api/project-requests', handle('project'));

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/dist');
app.use(express.static(dist));
app.get('*', (_q, res) => res.sendFile(path.join(dist, 'index.html'), (e) => e && res.status(404).end()));
app.use((e, _q, res, _n) => { console.error(e.message); res.status(400).json({ error: 'So‘rov noto‘g‘ri.' }); });
app.listen(PORT, () => {
  console.log(`EduX server: http://localhost:${PORT}`);
  if (!TOKEN || !CHAT) console.warn('OGOHLANTIRISH: TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID topilmadi. server/.env faylini tekshiring.');
});
