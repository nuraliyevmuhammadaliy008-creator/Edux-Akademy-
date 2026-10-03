import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const LINKS = {
  instagram: 'https://instagram.com/eduxacademy_',
  telegram: 'https://t.me/impulse_boss',
  youtube: import.meta.env.VITE_YOUTUBE_URL || '',
  phone: 'tel:+998931299926',
  // Nurafshon Mall, Amir Temur ko'chasi, Samarqand — foydalanuvchi bergan Google Earth havolasidagi koordinatalar
  mapsView: 'https://www.google.com/maps/search/?api=1&query=39.65131006,66.95240827',
  mapsEmbed: 'https://www.google.com/maps?q=39.65131006,66.95240827&z=17&output=embed',
};
const NAV = [['#courses', 'Kurslar'], ['#services', 'Xizmatlar'], ['#team', 'Xodimlar'], ['#contact', 'Aloqa']];
const COURSE_NAME = 'Mobilografiya + Content Marketing';
const COURSE_TOPICS = ['Kamera sozlamalari', 'Professional video syomka', 'CapCut montaj', 'Ekspert kontenti', 'Fashion syomka', 'Avtomobil syomkasi', 'Predmet / product syomka', 'Content marketing', 'Portfolio yaratish', 'Xizmatlarni bozorga chiqarish'];
// Brendlar qo'shish: nom va client/public/brands/ dagi fayl nomi
const BRANDS = [
  ['KHAN', '/brands/khan.png'],
  ['Aura Uzbekistan', '/brands/aura-uzbekistan.png'],
  ['Temurbek School', '/brands/temurbek-school.png'],
  ['Unifon', '/brands/unifon.png'],
  ['Nuts', '/brands/nuts.png'],
  ['MedExpert', '/brands/medexpert.png'],
];
const SERVICES = [
  { title: 'Content Marketing', items: ['Content strategy', 'Instagram content', 'Reels', 'Organic growth', 'Brand awareness', 'Organik savdoga yo‘naltirilgan kontent'] },
  { title: 'Mobileography', items: ['Professional syomka', 'Reels production', 'Ekspert kontenti', 'Product syomka', 'Fashion kontent', 'Avtomobil kontenti'] },
];
const WHY = [['Amaliy ta’lim', 'Nazariyadan ko‘ra ko‘proq amaliyot: telefon kamerasi va montaj bilan ishlaysiz.'], ['Portfolio', 'Kurs yakunida o‘z portfoliongizni shakllantirasiz.'], ['Real projectlar', 'EduX real bizneslar bilan ishlaydi — amaliyot haqiqiy vazifalar bilan bog‘lanadi.'], ['Bozorga chiqish', 'Xizmatlaringizni bozorga qanday taqdim etishni o‘rganasiz.']];
const PROCESS = ['Kursga qo‘shiling', 'Skill o‘rganing', 'Amaliyot qiling', 'Portfolio yarating', 'Real projectlarga chiqing'];
// Xodimlar qo'shish: { name, role, photo, bio, instagram, telegram }
const TEAM = [
  { name: 'Asadbek Kadirkulov', role: 'Videograf', photo: '/team/asadbek-kadirkulov.webp' },
  { name: 'Muhammadali Nuraliyev', role: 'Content manager', photo: '/team/muhammadali-nuraliyev.webp' },
  { name: 'Abdujalil Ulashov', role: 'Marketolog', photo: '/team/abdujalil-ulashov.webp' },
];
const FAQ = [
  ['EduX qanday kurslarni taklif qiladi?', `EduX «${COURSE_NAME}» kursi bo‘yicha amaliy ta’lim beradi.`],
  ['Mobilografiya kursi qancha davom etadi?', 'Mobilografiya + Content Marketing kursi 1 oy davom etadi.'],
  ['Kursda nimalar o‘rganiladi?', 'Kamera sozlamalari, professional video syomka, CapCut montaj, ekspert, fashion, avtomobil va product syomkasi, content marketing hamda portfolio yaratish.'],
  ['Kursga qanday yozilish mumkin?', 'Saytdagi «Kursga yozilish» tugmasini bosib arizani to‘ldiring — EduX jamoasi siz bilan bog‘lanadi.'],
  ['EduX bizneslar bilan ham ishlaydimi?', 'Ha. EduX bizneslar uchun content marketing va mobilografiya xizmatlarini taqdim etadi.'],
  ['Project uchun qanday murojaat qilish mumkin?', '93-129-99-26 raqamiga qo‘ng‘iroq qiling yoki Telegram (@impulse_boss) va Instagram (@eduxacademy_) orqali yozing.'],
];

const Btn = ({ variant = 'solid', className = '', ...p }) => (
  <button {...p} className={`min-h-12 rounded-full px-6 font-bold transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 ${variant === 'solid' ? 'bg-lime text-ink' : 'border border-line text-white hover:border-lime'} ${className}`} />
);

const Icon = ({ name }) => {
  const d = {
    instagram: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 4.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm5.2-1.2a1 1 0 100 2 1 1 0 000-2z',
    telegram: 'M21 4L3 11l6 2 2 6 3-4 5 4z',
    youtube: 'M3 7a3 3 0 013-3h12a3 3 0 013 3v10a3 3 0 01-3 3H6a3 3 0 01-3-3zm7 2v6l5-3z',
    phone: 'M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4.5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1z',
    pin: 'M12 22s7-7.2 7-12a7 7 0 10-14 0c0 4.8 7 12 7 12z M12 13a3 3 0 100-6 3 3 0 000 6z',
  }[name];
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
};

function Field({ label, error, children }) {
  return <label className="block text-sm text-mist">{label}{children}{error && <span role="alert" className="mt-1 block text-red-300">{error}</span>}</label>;
}
const input = 'mt-1 w-full rounded-lg border border-line bg-ink px-4 py-3 text-base text-white placeholder:text-mist/50';

const API_URL = 'https://edux-akademy.onrender.com';

const API_URL = 'https://edux-akademy.onrender.com';

const API_URL = 'https://edux-akademy.onrender.com';

const FORMS = {
  course: { 
    title: 'Kursga yozilish', 
    url: `${API_URL}/api/applications`, 
    fixedCourse: COURSE_NAME, 
    text: ['message', 'Izoh (ixtiyoriy)'] 
  },
  project: { 
    title: 'Project uchun murojaat', 
    url: `${API_URL}/api/project-requests`, 
    brand: true, 
    select: ['service', 'Kerakli xizmat', ['Content Marketing', 'Mobileography', 'Ikkalasi']], 
    text: ['message', 'Project haqida qisqacha ma’lumot'] 
  },
};
const validPhone = (p) => { const d = p.replace(/\D/g, ''); return d.length === 12 && d.startsWith('998'); };
// Doim +998 bilan boshlanadi; qolgan 9 raqam "XX XXX XX XX" shaklida
const formatPhone = (raw) => {
  let d = raw.replace(/\D/g, '');
  if (raw.trim().startsWith('+998') || (d.startsWith('998') && d.length >= 12)) d = d.slice(3);
  d = d.slice(0, 9);
  return '+998 ' + [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');
};

function FormModal({ kind, onClose }) {
  const cfg = FORMS[kind];
  const [v, setV] = useState({ name: '', phone: '+998 ', brand: '', course: cfg.fixedCourse || '', service: '', message: '' });
  const [errs, setErrs] = useState({});
  const [state, setState] = useState('idle');
  const [srvErr, setSrvErr] = useState('');
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc); document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (v.name.trim().length < 2) er.name = 'Ismingizni kiriting.';
    if (!validPhone(v.phone)) er.phone = 'Telefon raqamni to‘liq kiriting: +998 XX XXX XX XX.';
    if (cfg.brand && !v.brand.trim()) er.brand = 'Brend yoki kompaniya nomini kiriting.';
    if (cfg.select && !v[cfg.select[0]]) er[cfg.select[0]] = 'Variantlardan birini tanlang.';
    setErrs(er); setSrvErr('');
    if (Object.keys(er).length) return;
    setState('loading');
    try {
      const r = await fetch(cfg.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'Xatolik yuz berdi.');
      setState('done');
    } catch (err) { setSrvErr(err instanceof TypeError ? 'Internet aloqasini tekshiring va qayta urinib ko‘ring.' : err.message); setState('idle'); }
  };

  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div role="dialog" aria-modal="true" aria-labelledby="dlg" className="glass-strong max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl p-6" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}>
        {state === 'done' ? (
          <div className="py-8 text-center">
            <motion.svg initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} viewBox="0 0 24 24" className="mx-auto h-16 w-16 text-lime" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M7 12.5l3.5 3.5L17 9" /></motion.svg>
            <h2 id="dlg" className="mt-5 font-display text-2xl">Arizangiz yuborildi.</h2>
            <p className="mt-2 text-mist">EduX jamoasi tez orada siz bilan bog‘lanadi.</p>
            <Btn className="mt-6" onClick={onClose}>Yopish</Btn>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <div className="flex items-start justify-between"><h2 id="dlg" className="font-display text-xl">{cfg.title}</h2><button type="button" onClick={onClose} aria-label="Yopish" className="p-1 text-2xl leading-none text-mist">×</button></div>
            <Field label="Ism" error={errs.name}><input className={input} value={v.name} onChange={set('name')} autoComplete="name" autoFocus /></Field>
            <Field label="Telefon raqam" error={errs.phone}><input className={input} type="tel" inputMode="tel" placeholder="+998 90 123 45 67" maxLength={17} value={v.phone} onChange={(e) => setV({ ...v, phone: formatPhone(e.target.value) })} autoComplete="tel" /></Field>
            {cfg.brand && <Field label="Brend / kompaniya nomi" error={errs.brand}><input className={input} value={v.brand} onChange={set('brand')} /></Field>}
            {cfg.fixedCourse && (
              <div><span className="block text-sm text-mist">Kurs</span><p className="mt-1 rounded-lg border border-line bg-ink px-4 py-3 text-white">{cfg.fixedCourse}</p></div>
            )}
            {cfg.select && (
              <Field label={cfg.select[1]} error={errs[cfg.select[0]]}>
                <select className={input} value={v[cfg.select[0]]} onChange={set(cfg.select[0])}><option value="">Tanlang</option>{cfg.select[2].map((o) => <option key={o}>{o}</option>)}</select>
              </Field>
            )}
            <Field label={cfg.text[1]}><textarea className={input} rows={3} maxLength={500} value={v.message} onChange={set('message')} /></Field>
            {srvErr && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{srvErr}</p>}
            <Btn type="submit" disabled={state === 'loading'} className="w-full disabled:opacity-60">{state === 'loading' ? 'Yuborilmoqda…' : 'Ariza yuborish'}</Btn>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

const Section = ({ id, title, children, className = '' }) => (
  <section id={id} className={`mx-auto max-w-6xl px-5 py-20 md:py-28 ${className}`}>
    <h2 className="max-w-2xl font-display text-3xl leading-tight md:text-4xl">{title}</h2>
    <div className="mt-10">{children}</div>
  </section>
);

function SocialOrbit() {
  const calm = useReducedMotion();
  const items = [['instagram', 'Instagram', LINKS.instagram, 'left-0 top-6'], ['telegram', 'Telegram', LINKS.telegram, 'right-0 top-24'], ['youtube', 'YouTube', LINKS.youtube, 'left-8 bottom-4']].filter((i) => i[2]);
  return (
    <div className="relative mx-auto h-80 w-full max-w-md md:h-[26rem]">
      <div className="glass absolute inset-x-10 inset-y-4 grid place-items-center rounded-[2rem]">
        <p className="font-display text-7xl text-lime md:text-8xl">EduX</p>
        <p className="absolute bottom-8 text-sm text-mist">Learn. Create. Build. Grow.</p>
      </div>
      {items.map(([n, label, href, pos], i) => (
        <motion.a key={n} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
          className={`glass absolute ${pos} flex items-center gap-2 rounded-full px-4 py-3 text-white transition-[box-shadow,color] hover:text-lime hover:shadow-[0_0_24px_rgba(198,255,61,.35)]`}
          animate={calm ? undefined : { y: [0, -10, 0] }} transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }} whileHover={{ scale: 1.06 }}>
          <Icon name={n} /><span className="text-sm font-bold">{label}</span>
        </motion.a>
      ))}
    </div>
  );
}

function LogoMarquee() {
  const calm = useReducedMotion();
  const row = [...BRANDS, ...BRANDS];
  return (
    <div className="w-full border-y border-line bg-deep/60 py-10">
      <p className="mx-auto mb-7 max-w-6xl px-5 text-center text-xs uppercase tracking-[0.25em] text-mist">Biz bilan ishlagan brendlar</p>
      <div className="group w-full overflow-hidden">
        <div className={`flex w-max items-center gap-16 ${calm ? '' : 'animate-marquee group-hover:[animation-play-state:paused]'}`}>
          {row.map(([name, src], i) => (
            <div key={`${name}-${i}`} className="flex shrink-0 items-center gap-3 opacity-70 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0">
              <img src={src} alt={name} width={48} height={48} loading="lazy" decoding="async" className="h-12 w-12 shrink-0 rounded-full object-cover" />
              <span className="whitespace-nowrap font-display text-base tracking-wide text-white">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [modal, setModal] = useState(null);
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 20); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  const reveal = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.45 } };

  return (
    <>
      <header className={`glass fixed inset-x-0 top-0 z-40 transition-shadow ${scrolled ? 'shadow-[0_8px_24px_rgba(0,0,0,.35)]' : ''}`}>
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5" aria-label="Asosiy menyu">
          <a href="#top" className="font-display text-xl">Edu<span className="text-lime">X</span></a>
          <ul className="hidden items-center gap-8 md:flex">{NAV.map(([h, t]) => <li key={h}><a href={h} className="text-mist hover:text-white">{t}</a></li>)}</ul>
          <Btn className="hidden !min-h-10 !px-5 md:block" onClick={() => setModal('course')}>Kursga yozilish</Btn>
          <button className="p-2 md:hidden" aria-expanded={menu} aria-label="Menyu" onClick={() => setMenu(!menu)}>
            <svg viewBox="0 0 24 24" className="h-7 w-7" stroke="currentColor" strokeWidth="2" fill="none"><path d={menu ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
          </button>
        </nav>
        {menu && (
          <div className="border-t border-line px-5 pb-5 md:hidden">
            {NAV.map(([h, t]) => <a key={h} href={h} onClick={() => setMenu(false)} className="block py-3 text-lg">{t}</a>)}
            <Btn className="mt-2 w-full" onClick={() => { setMenu(false); setModal('course'); }}>Kursga yozilish</Btn>
          </div>
        )}
      </header>

      <main id="top">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-28 md:grid-cols-2 md:gap-12 md:pb-24 md:pt-40">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="order-2 md:order-1">
            <h1 className="font-display text-3xl leading-[1.15] sm:text-4xl lg:text-5xl">Media orqali brendingizni tanitishga yordam beramiz</h1>
            <p className="mt-6 max-w-xl text-lg text-mist">EduX — SMM, mobilografiya va content marketing yo‘nalishlarida amaliy ta’lim beruvchi hamda real loyihalar bilan ishlovchi zamonaviy markaz.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Btn onClick={() => setModal('course')}>Kursga yozilish</Btn>
            </div>
          </motion.div>
          <div className="order-1 md:order-2"><SocialOrbit /></div>
        </div>

        <LogoMarquee />

        <Section id="courses" title="Kurslar">
          <motion.article {...reveal} className="glass-strong rounded-2xl p-8 md:p-10">
            <p className="text-lime">1 oy</p>
            <h3 className="mt-2 font-display text-2xl md:text-3xl">{COURSE_NAME}</h3>
            <p className="mt-4 max-w-2xl text-mist">Ushbu dastur telefon kamerasi bilan professional video syomka qilish va CapCut'da montaj qilishni noldan o‘rgatadigan amaliy kursdir. O‘quvchi kamera sozlamalaridan tortib, ekspert kontenti, fashion, avtomobil va predmet syomkasigacha bo‘lgan barcha yo‘nalishlarni bosqichma-bosqich o‘zlashtiradi. Kurs yakunida o‘quvchi o‘z portfoliosini shakllantirib, xizmatlarini bozorga taqdim etishni o‘rganadi.</p>
            <ul className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">{COURSE_TOPICS.map((t) => <li key={t} className="flex gap-2"><span className="text-lime" aria-hidden="true">+</span>{t}</li>)}</ul>
            <Btn className="mt-8" onClick={() => setModal('course')}>Kursga yozilish</Btn>
          </motion.article>
        </Section>

        <Section id="services" title="Biznesingiz uchun kontent">
          <p className="-mt-6 mb-10 max-w-2xl text-mist">EduX real loyihalar bilan ishlaydi: g‘oyadan tayyor kontentgacha.</p>
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICES.map((s) => (
              <motion.article key={s.title} {...reveal} className="glass rounded-2xl p-8 transition-colors hover:border-lime/60">
                <h3 className="font-display text-2xl">{s.title}</h3>
                <ul className="mt-5 space-y-2 text-mist">{s.items.map((i) => <li key={i} className="flex gap-2"><span className="text-lime" aria-hidden="true">+</span>{i}</li>)}</ul>
              </motion.article>
            ))}
          </div>
          <Btn className="mt-8" onClick={() => setModal('course')}>Kursga yozilish</Btn>
        </Section>

        <Section title="Nega EduX">
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {WHY.map(([t, d], i) => <motion.div key={t} {...reveal} className="border-t border-line pt-5"><p className="font-display text-lime">0{i + 1}</p><h3 className="mt-2 text-xl font-bold">{t}</h3><p className="mt-2 text-mist">{d}</p></motion.div>)}
          </div>
          <Btn className="mt-10" onClick={() => setModal('course')}>Kursga yozilish</Btn>
        </Section>

        <Section title="Qanday ishlaydi">
          <ol className="grid gap-6 md:grid-cols-5">
            {PROCESS.map((p, i) => <motion.li key={p} {...reveal} transition={{ duration: 0.45, delay: i * 0.08 }} className="relative border-t-2 border-lime pt-4"><span className="font-display text-mist">0{i + 1}</span><p className="mt-2 text-lg font-bold">{p}</p></motion.li>)}
          </ol>
          <Btn className="mt-10" onClick={() => setModal('course')}>Kursga yozilish</Btn>
        </Section>

        <Section id="faq" title="Ko‘p so‘raladigan savollar">
          <div className="max-w-3xl divide-y divide-line border-y border-line">
            {FAQ.map(([q, a], i) => (
              <div key={q}>
                <h3><button className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-bold" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{q}<span className="text-2xl text-lime" aria-hidden="true">{open === i ? '−' : '+'}</span></button></h3>
                <AnimatePresence initial={false}>{open === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-5 text-mist">{a}</motion.p>}</AnimatePresence>
              </div>
            ))}
          </div>
          <Btn className="mt-10" onClick={() => setModal('course')}>Kursga yozilish</Btn>
        </Section>

        <Section id="team" title="Jamoamiz">
          {TEAM.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{TEAM.map((m, i) => (
              <motion.article key={m.name} {...reveal} transition={{ duration: 0.45, delay: i * 0.08 }} className="glass group rounded-2xl p-3 transition-colors hover:border-lime/60">
                {m.photo && <img src={m.photo} alt={`${m.name} — ${m.role}`} width={800} height={800} loading="lazy" decoding="async" className="aspect-square w-full rounded-xl object-cover" />}
                <div className="px-2 pb-2 pt-4">
                  <h3 className="text-lg font-bold">{m.name}</h3>
                  <p className="mt-1 text-sm text-lime">{m.role}</p>
                  {m.bio && <p className="mt-2 text-mist">{m.bio}</p>}
                </div>
              </motion.article>))}</div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center backdrop-blur-md">
              <p className="font-display text-xl">Jamoa a’zolari tez orada shu yerda paydo bo‘ladi.</p>
              <p className="mx-auto mt-3 max-w-md text-mist">EduX jamoasi bilan tanishtiruvchi ma’lumot hozirda tayyorlanmoqda.</p>
            </div>
          )}
          <Btn className="mt-8" onClick={() => setModal('course')}>Kursga yozilish</Btn>
        </Section>

        <Section id="contact" title="Aloqa">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['phone', 'Telefon', '93-129-99-26', LINKS.phone, false],
              ['instagram', 'Instagram', '@eduxacademy_', LINKS.instagram, true],
              ['telegram', 'Telegram', '@impulse_boss', LINKS.telegram, true],
              ['pin', 'Manzil', 'Nurafshon Mall, Amir Temur ko‘chasi, Samarqand', LINKS.mapsView, true],
            ].map(([icon, label, value, href, ext]) => {
              const Card = href ? motion.a : motion.div;
              return (
                <Card key={label} {...reveal} {...(href ? { href, target: ext ? '_blank' : undefined, rel: ext ? 'noopener noreferrer' : undefined } : {})}
                  className="glass flex flex-col items-start gap-3 rounded-2xl p-6 transition-colors hover:border-lime/60">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-lime"><Icon name={icon} /></span>
                  <p className="text-sm text-mist">{label}</p>
                  <p className="font-bold leading-snug">{value}</p>
                </Card>
              );
            })}
          </div>

          <motion.div {...reveal} className="mt-6 overflow-hidden rounded-2xl border border-line">
            <iframe src={LINKS.mapsEmbed} title="EduX manzili xaritada" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-72 w-full grayscale-[35%] contrast-[1.05] sm:h-96" />
          </motion.div>

          <div className="mt-10">
            <Btn onClick={() => setModal('course')}>Kursga yozilish</Btn>
          </div>
        </Section>
      </main>

      <footer className="border-t border-line px-5 py-8 text-center text-sm text-mist">© {new Date().getFullYear()} EduX. Barcha huquqlar himoyalangan.</footer>
      <AnimatePresence>{modal && <FormModal key={modal} kind={modal} onClose={() => setModal(null)} />}</AnimatePresence>
    </>
  );
}
