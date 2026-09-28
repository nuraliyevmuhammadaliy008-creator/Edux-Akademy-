# EduX

React + Vite + Tailwind + Framer Motion frontend, Express backend, Telegram Bot delivery.

## Tez ishga tushirish (eng oson)
Windows: `start.bat` ni ikki marta bosing. Mac/Linux: `./start.sh`.
Birinchi ishga tushirishda paketlar o‘rnatiladi, sayt yig‘iladi va `npm run setup` Telegram botni ulashda yordam beradi (token so‘raydi, chat ID ni o‘zi topadi, test xabar yuboradi). Keyin sayt http://localhost:3001 da ochiladi.

## Batafsil (dev rejim)
1. ``npm run setup`` va `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` ni to‘ldiring.
2. `cd server && npm i && npm run dev`
3. `cd client && npm i && npm run dev` (http://localhost:5173, `/api` proksi qilinadi)
4. Production: `cd client && npm run build`, so‘ng `cd server && npm start` (Express `client/dist` ni ham beradi).

## Kontent qo‘shish
- Loyihalar: `client/src/App.jsx` ichidagi `PROJECTS` massivi.
- YouTube: `client/.env` ga `VITE_YOUTUBE_URL=...`.
- Logo: `client/public/logo.svg` qo‘shing va `App.jsx` dagi matnli wordmark o‘rniga `<img>` qo‘ying.
- Domen: `index.html`, `robots.txt`, `sitemap.xml` dagi `https://edux.uz/` ni haqiqiy domenga almashtiring.

## Telegram botni ulash
1. Telegramda @BotFather ga `/newbot` yozing, bot yarating va tokenni oling.
2. Yaratilgan botga kirib `/start` bosing (arizalar guruhga kelsin desangiz, botni guruhga qo‘shib, guruhda biror xabar yozing).
3. Tokenni `server/.env` ga `TELEGRAM_BOT_TOKEN=` qilib yozing.
4. `npm run telegram:setup` ni ishga tushiring, chiqqan `TELEGRAM_CHAT_ID=...` qatorini `server/.env` ga qo‘shing.
5. Serverni qayta ishga tushiring. Tekshirish: http://localhost:3001/api/health → `telegramConfigured: true`.

## 502 xatosi chiqsa ("Arizani yuborib bo'lmadi")
Bu forma to‘g‘ri ishlayapti, lekin server Telegramga xabar yubora olmayapti degani. Tekshirish:
1. `npm run telegram:test` — joriy `.env` bilan botga sinov xabari yuboradi va aniq sababni yozadi:
   - **401** — token noto‘g‘ri yoki bekor qilingan → yangi token oling.
   - **chat not found** — `TELEGRAM_CHAT_ID` noto‘g‘ri yoki botga `/start` bosilmagan → `npm run setup` ni qayta ishga tushiring.
2. `http://localhost:3001/api/health` ni brauzerda oching. `telegramConfigured: false` bo‘lsa, `.env` o‘qilmayapti.
3. Serverni ishga tushirgan terminaldagi "OGOHLANTIRISH" yoki "Telegram 4xx/5xx" qatoriga qarang — u yerda aniq xato yoziladi.

Eslatma: agar saytni `npm run dev:client` (5173-port) orqali ochgan bo‘lsangiz, `npm run dev:server` (3001-port) ham alohida ishlab turishi kerak — aks holda so‘rovlar hech qayerga bormaydi.

## "Token noto'g'ri yoki internet yo'q" chiqsa
Bu ikki xil sababdan bo'lishi mumkin, endi skript ularni aniq ajratib ko'rsatadi:
- **Tarmoq muammosi** (eng ko'p uchraydigan holat): kompyuter `api.telegram.org` manziliga umuman chiqa olmayapti — bu token bilan bog'liq emas. Tekshirish: terminalda `curl.exe "https://api.telegram.org"` ishga tushiring. Xato chiqsa, tarmoq/provayder/firewall/antivirus/VPN Telegram Bot API'sini bloklayapti. Yechim: telefon hotspot yoki boshqa Wi-Fi bilan urinib ko'ring, yoki ishonchli VPN yoqib sinab ko'ring, yoki antivirus/firewall'ni vaqtincha o'chirib ko'ring.
- **Token noto'g'ri**: bu holatda skript aniq shunday deydi va BotFather'dan tokenni to'liq (ikki nuqta bilan birga) qayta nusxalashni so'raydi.

## Xodimlar bo'limi
Navbarda "Xodimlar" bandi va sahifada shu nomdagi bo'lim ochilgan, hozircha "tez orada" holatida. Xodimlarni qo'shish uchun `client/src/App.jsx` faylidagi `TEAM` massivini to'ldiring, masalan:
```js
const TEAM = [
  { name: 'Ism Familiya', role: 'Lavozimi', photo: '/team/ism.jpg', bio: 'Qisqa tavsif (ixtiyoriy)' },
];
```
Fotolarni `client/public/team/` papkasiga qo'ying.

## Brendlar karuseli
Hero ostidagi "Biz bilan ishlagan brendlar" karuseli `client/src/App.jsx` dagi `BRANDS` massividan olinadi. Yangi brend qo'shish uchun logotipni `client/public/brands/` papkasiga qo'ying va massivga bir qator qo'shing:
```js
const BRANDS = [
  ['Brend nomi', '/brands/fayl-nomi.png'],
];
```

## Xarita (Aloqa bo'limi)
Manzil kartasi va katta xarita `client/src/App.jsx` dagi `LINKS.mapsView` (bosilganda Google Maps'da ochiladi) va `LINKS.mapsEmbed` (saytga o'rnatilgan xarita) orqali ishlaydi. Koordinatalar sizning Google Earth havolangizdan olindi (39.65131006, 66.95240827 — Nurafshon Mall, Amir Temur ko'chasi, Samarqand). Manzil o'zgarsa, shu ikkita qatorni yangi koordinata bilan almashtiring.

## Glassmorphism va "Kursga yozilish" tugmalari
- Header va kartalarning aksariyatida (kurs, xizmat, jamoa, loyiha, aloqa kartalari, modal oyna) o'rtacha darajadagi shaffof-xiralashgan (glass) uslub qo'llanildi — `client/src/index.css` dagi `.glass` va `.glass-strong` klasslari orqali. Darajasini o'zgartirish uchun shu ikki klassdagi `background`/`backdrop-filter` qiymatlarini sozlang.
- Har bir asosiy bo'lim (Kurslar, Xizmatlar, Nega EduX, Bizning ishlar, Qanday ishlaydi, FAQ, Jamoamiz, Aloqa) pastida "Kursga yozilish" tugmasi qo'shildi.
- Brendlar karuseli endi `translate3d` va sobit rasm o'lchamlari bilan ishlaydi — bu tugash/qayta boshlanish nuqtasidagi "qotib qolish"ni kamaytiradi.

## Jamoa a'zolari
Rasmlar `client/public/team/` papkasida (800x800 WebP). Yangi xodim qo'shish: rasmni shu papkaga qo'ying va `App.jsx` dagi `TEAM` massiviga `{ name, role, photo }` qo'shing.
