import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";

const projects = [
  { name: "StudyVault", kind: "Academic resource platform", year: "2025", stack: ["React", "Express", "Firebase", "Cloudinary"], description: "A student resource library for finding, sharing, rating, and downloading useful course material.", details: "StudyVault brings course material into one searchable library. Students can sign in, upload resources, browse what others have shared, and rate or download material.", features: ["Authentication and protected flows", "Resource uploads and discovery", "Ratings and downloads"], href: "https://studyvaultapp.vercel.app/", github: "https://github.com/umar24nov/StudyVault" },
  { name: "Student Performance Predictor", kind: "Machine learning", year: "2025", stack: ["Python", "Pandas", "NumPy", "Scikit-learn"], description: "A machine-learning project that explores student outcomes and predicts academic performance.", details: "The project covers data cleaning, feature analysis, model training, and evaluation to predict student performance categories and surface learners who may need support.", features: ["Data preprocessing and exploration", "Feature analysis", "Model comparison and evaluation"], href: "https://academic-ai-app.vercel.app/", github: "https://github.com/umar24nov/student-performance-predictor" },
  { name: "Amtul Noor Library", kind: "Full-stack library platform", year: "2026", stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"], description: "A production library platform that replaced a paper-and-spreadsheet workflow with member self-service and daily operations tools.", details: "Designed and built for a reading room in Roorkee, Amtul Noor Library combines a public site with a complete management system for members, applications, seat assignments, monthly fees, payments, and receipts.", features: ["Member applications, payment pages, and digital receipts", "Seat map, member records, and monthly fee tracking", "Role-based admin access and an auditable change history"], href: "https://www.amtulnoorlibrary.in/", github: "https://github.com/umar24nov/amtul-noor-library" },
  { name: "Personal Portfolio", kind: "Digital identity", year: "2026", stack: ["React", "Tailwind CSS", "Cloudflare Workers", "D1"], description: "A portfolio for presenting my projects, experience, and the ideas behind the work.", details: "A responsive portfolio built around concise project stories, a continuous page experience, and a direct way to start a conversation.", features: ["Responsive single-page experience", "Interactive project case studies", "Cloudflare Worker contact API and D1 storage"], href: "https://mohammadumar-portfoloi.vercel.app/", github: "https://github.com/umar24nov/portfoloi" },
];
const groups = [
  ["Programming", "C++", "JavaScript", "Python"],
  ["Frontend", "HTML", "CSS", "JavaScript", "React", "Next.js", "Tailwind CSS"],
  ["Backend", "Node.js", "Express.js", "REST APIs"],
  ["AI and ML", "Python", "Pandas", "NumPy", "Scikit-learn"],
  ["Tools", "Git", "GitHub", "Firebase", "Cloudinary", "Cloudflare", "ServiceNow"],
  ["Core concepts", "Data Structures and Algorithms", "OOP", "DBMS", "Computer Networks"],
];
const nav = [["Intro", "home"], ["About", "about"], ["Work", "projects"], ["Experience", "experience"], ["Skills", "skills"], ["Contact", "contact"]];
const validPages = new Set([...nav.map(([, id]) => id), "achievements"]);
const pageFromHash = () => {
  const page = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return validPages.has(page) ? page : "home";
};

function Arrow({ diagonal = false }) { return <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none"><path d={diagonal ? "M5 15 15 5M6 5h9v9" : "M3 10h13m-5-5 5 5-5 5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function Eyebrow({ children }) { return <p className="eyebrow">{children}</p>; }
function SectionTitle({ eyebrow, children, id }) { return <div className="mb-8 md:mb-12"><Eyebrow>{eyebrow}</Eyebrow><motion.h2 id={id} className="section-title mt-4" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.h2></div>; }

function HeroSculpture() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true, desynchronized: true });
    if (!canvas || !context) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pathAt = (u) => {
      const q = (3 / 2) * u;
      const radius = 1.5 * (2 + Math.cos(q)) / 2;
      return { x: radius * Math.cos(2 * u), y: radius * Math.sin(2 * u), z: .75 * Math.sin(q) };
    };
    const points = [];
    for (let i = 0; i < 220; i += 1) {
      const u = (i / 220) * Math.PI * 2;
      const center = pathAt(u);
      const before = pathAt(u - .002);
      const after = pathAt(u + .002);
      let tx = after.x - before.x; let ty = after.y - before.y; let tz = after.z - before.z;
      const tangentLength = Math.hypot(tx, ty, tz) || 1; tx /= tangentLength; ty /= tangentLength; tz /= tangentLength;
      let nx = -ty; let ny = tx; let nz = 0;
      let normalLength = Math.hypot(nx, ny, nz);
      if (normalLength < .0001) { nx = 1; ny = 0; nz = 0; normalLength = 1; }
      nx /= normalLength; ny /= normalLength;
      const bx = ty * nz - tz * ny; const by = tz * nx - tx * nz; const bz = tx * ny - ty * nx;
      for (let j = 0; j < 14; j += 1) {
        const v = (j / 14) * Math.PI * 2;
        const tube = .46;
        const c = Math.cos(v) * tube; const s = Math.sin(v) * tube;
        points.push({ x: center.x + nx * c + bx * s, y: center.y + ny * c + by * s, z: center.z + nz * c + bz * s, accent: (i * 7 + j * 11) % 37 < 2 });
      }
    }
    let width = 0; let height = 0; let pixelRatio = 1; let frame = 0; let visible = true; let pointerX = 0; let pointerY = 0; let targetX = 0; let targetY = 0;
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width; height = box.height;
      canvas.width = Math.round(width * pixelRatio); canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(reduced ? 0 : performance.now() * .001);
    };
    const onPointer = (event) => {
      if (event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - .5) * 1.15;
      targetY = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - .5) * .8;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };
    const project = (point, yaw, pitch, scale, cx, cy, camera) => {
      const x = point.x * Math.cos(yaw) + point.z * Math.sin(yaw);
      const z = -point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
      const y = point.y * Math.cos(pitch) - z * Math.sin(pitch);
      const depth = point.y * Math.sin(pitch) + z * Math.cos(pitch);
      const perspective = camera / (camera - depth);
      return { x: cx + x * scale * perspective, y: cy - y * scale * perspective, depth };
    };
    const draw = (time) => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      const cx = width * .5; const cy = height * .5;
      const scale = Math.min(width, height) * .158;
      const t = reduced ? .2 : time;
      const scroll = Math.max(0, Math.min(1, window.scrollY / Math.max(window.innerHeight, 1)));
      pointerX += (targetX - pointerX) * .055; pointerY += (targetY - pointerY) * .055;
      const yaw = t * .15 + scroll * 1.35 + pointerX;
      const pitch = .25 + Math.sin(t * .25) * .1 + scroll * .3 + pointerY;
      const camera = 6.8;
      const foreground = getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#eeeeea";
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#5470ff";
      const rings = [
        { rx: 2.95, ry: 1.1, angle: -.62, alpha: .2 },
        { rx: 2.55, ry: 1.2, angle: .68, alpha: .16 },
        { rx: 2.05, ry: 2.05, angle: 0, alpha: .12 },
      ];
      rings.forEach((ring) => {
        context.beginPath(); context.strokeStyle = foreground; context.globalAlpha = ring.alpha; context.lineWidth = .7;
        for (let i = 0; i <= 90; i += 1) {
          const a = (i / 90) * Math.PI * 2;
          const x = Math.cos(a) * ring.rx; const y = Math.sin(a) * ring.ry;
          const rotatedX = x * Math.cos(ring.angle) - y * Math.sin(ring.angle);
          const rotatedY = x * Math.sin(ring.angle) + y * Math.cos(ring.angle);
          const p = project({ x: rotatedX, y: rotatedY, z: 0 }, yaw, pitch, scale, cx, cy, camera);
          if (i === 0) context.moveTo(p.x, p.y); else context.lineTo(p.x, p.y);
        }
        context.closePath(); context.stroke();
      });
      for (const point of points) {
        const ripple = Math.sin(point.x * 2 + t * 1.4) * .025;
        const p = project({ x: point.x + point.x * ripple, y: point.y + point.y * ripple, z: point.z + Math.sin(point.x + t) * .018 }, yaw, pitch, scale, cx, cy, camera);
        context.globalAlpha = Math.max(.16, .82 - (1 - p.depth / 3) * .38);
        context.fillStyle = point.accent ? accent : foreground;
        const size = (point.accent ? 1.55 : 1.05) + Math.max(-.15, p.depth * .11);
        context.beginPath(); context.arc(p.x, p.y, size, 0, Math.PI * 2); context.fill();
      }
      const orbital = t * .7;
      const orb = project({ x: Math.cos(orbital) * 2.95, y: Math.sin(orbital) * 1.1, z: 0 }, yaw, pitch, scale, cx, cy, camera);
      context.globalAlpha = .95; context.fillStyle = accent; context.beginPath(); context.arc(orb.x, orb.y, 3.1, 0, Math.PI * 2); context.fill();
      context.globalAlpha = 1;
    };
    const animate = (now) => {
      if (reduced || !visible || document.hidden) { frame = 0; return; }
      draw(now * .001);
      frame = requestAnimationFrame(animate);
    };
    const start = () => { if (!reduced && visible && !document.hidden && !frame) frame = requestAnimationFrame(animate); };
    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas);
    const viewObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else stop(); }, { threshold: 0 });
    viewObserver.observe(canvas);
    canvas.addEventListener("pointermove", onPointer, { passive: true });
    canvas.addEventListener("pointerleave", onLeave, { passive: true });
    document.addEventListener("visibilitychange", start);
    const themeObserver = new MutationObserver(() => { if (reduced) draw(0); });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    resize();
    start();
    return () => { stop(); resizeObserver.disconnect(); viewObserver.disconnect(); themeObserver.disconnect(); canvas.removeEventListener("pointermove", onPointer); canvas.removeEventListener("pointerleave", onLeave); document.removeEventListener("visibilitychange", start); };
  }, []);
  return <canvas ref={canvasRef} className="sculpture-canvas" aria-hidden="true" />;
}

function BrandMark() {
  return <svg className="brand-symbol" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle className="brand-symbol-bg" cx="32" cy="32" r="31"/><text className="brand-symbol-monogram" x="32" y="40" textAnchor="middle" textLength="31" lengthAdjust="spacingAndGlyphs">MU</text></svg>;
}

function CursorEffects() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return undefined;
    const magnets = Array.from(document.querySelectorAll(".magnetic"));
    const magnetMove = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const amount = event.currentTarget.classList.contains("assistant-nav-trigger") ? .12 : .22;
      event.currentTarget.style.translate = `${(event.clientX - rect.left - rect.width / 2) * amount}px ${(event.clientY - rect.top - rect.height / 2) * amount}px`;
    };
    const magnetLeave = (event) => { event.currentTarget.style.translate = "0 0"; };
    magnets.forEach((element) => { element.addEventListener("pointermove", magnetMove, { passive: true }); element.addEventListener("pointerleave", magnetLeave, { passive: true }); });
    const artwork = Array.from(document.querySelectorAll(".project-art"));
    const artMove = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
      const ny = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
      event.currentTarget.style.setProperty("--tilt-x", `${nx * 3.5}deg`);
      event.currentTarget.style.setProperty("--tilt-y", `${ny * -3.5}deg`);
      event.currentTarget.style.setProperty("--art-x", `${nx * -7}px`);
      event.currentTarget.style.setProperty("--art-y", `${ny * -6}px`);
    };
    const artLeave = (event) => { ["--tilt-x", "--tilt-y", "--art-x", "--art-y"].forEach((property) => event.currentTarget.style.removeProperty(property)); };
    artwork.forEach((element) => { element.addEventListener("pointermove", artMove, { passive: true }); element.addEventListener("pointerleave", artLeave, { passive: true }); });
    return () => { magnets.forEach((element) => { element.removeEventListener("pointermove", magnetMove); element.removeEventListener("pointerleave", magnetLeave); element.style.translate = ""; }); artwork.forEach((element) => { element.removeEventListener("pointermove", artMove); element.removeEventListener("pointerleave", artLeave); artLeave({ currentTarget: element }); }); };
  }, []);
  return null;
}

function ProjectArtwork({ index, title }) {
  const artworkId = useId().replace(/:/g, "");
  return <svg className="project-artwork" viewBox="0 0 800 550" role="img" aria-label={`${title} project illustration`}>
    <defs><pattern id={`grid-${artworkId}`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" strokeOpacity=".12" /></pattern><linearGradient id={`glow-${artworkId}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--accent)" stopOpacity=".24" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
    <rect width="800" height="550" fill="var(--surface)" /><rect width="800" height="550" fill={`url(#grid-${artworkId})`} /><rect width="800" height="550" fill={`url(#glow-${artworkId})`} />
    {index === 0 && <g><rect x="56" y="58" width="688" height="434" rx="8" fill="#11151d" stroke="#46516b"/><path d="M56 101h688" stroke="#333b50"/><circle cx="78" cy="80" r="5" fill="#f26c65"/><circle cx="96" cy="80" r="5" fill="#e6bd54"/><circle cx="114" cy="80" r="5" fill="#5fc26a"/><rect x="260" y="69" width="320" height="20" rx="10" fill="#0b0e14"/><text x="278" y="83" fill="#9ca7be" fontSize="9" fontFamily="monospace">studyvault / explore</text><rect x="80" y="124" width="636" height="74" rx="6" fill="#1c2840"/><text x="101" y="149" fill="#9baed9" fontSize="10" fontFamily="monospace" letterSpacing="1.3">STUDYVAULT / RESOURCE LIBRARY</text><text x="101" y="180" fill="#f2f5fc" fontSize="23" fontFamily="sans-serif" fontWeight="600">Find your next study resource.</text><rect x="530" y="143" width="164" height="34" rx="17" fill="#5470ff"/><text x="554" y="165" fill="#fff" fontSize="11" fontFamily="sans-serif" fontWeight="600">Browse library →</text><text x="82" y="230" fill="#a9b0c0" fontSize="10" fontFamily="monospace" letterSpacing="1.1">POPULAR THIS WEEK</text>{[0,1,2].map((row) => <g key={row}><rect x={82 + row * 207} y="246" width="190" height="180" rx="5" fill="#171e2b" stroke="#30394c"/><rect x={97 + row * 207} y="261" width="160" height="82" rx="3" fill={row === 0 ? "#273958" : row === 1 ? "#3b3037" : "#263941"}/><rect x={110 + row * 207} y="274" width="27" height="55" rx="2" fill="#f1eee5"/><path d={`M116 ${286}h15m-15 8h15m-15 8h11m-11 8h15`} stroke="#8991a1" strokeWidth="2"/>{row === 1 && <path d="M171 327v-20l18-11 18 15 20-24" fill="none" stroke="#f0a878" strokeWidth="3"/>}{row === 2 && <circle cx="365" cy="302" r="23" fill="none" stroke="#73b7a1" strokeWidth="6"/>}<path d={`M98 ${364}h105m-105 13h78`} stroke="#8790a4" strokeWidth="4" strokeLinecap="round"/><rect x={98 + row * 207} y="398" width="47" height="15" rx="7" fill="#263c7b"/><text x={104 + row * 207} y="409" fill="#c8d4ff" fontSize="8" fontFamily="monospace">{row === 0 ? "NOTES" : row === 1 ? "GUIDE" : "PAPER"}</text></g>)}</g>}
    {index === 1 && <g><path d="M102 452V94M102 452h600" fill="none" stroke="var(--fg)" strokeOpacity=".65"/><text x="405" y="505" textAnchor="middle" fill="var(--muted)" fontSize="13" fontFamily="monospace">STUDENT FEATURE SPACE</text><path d="M112 414C228 401 261 325 342 307s117-116 204-136 95-64 148-78" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 8"/>{Array.from({ length: 54 }, (_, dot) => { const x = 132 + ((dot * 71) % 540); const y = 130 + ((dot * 97) % 280); const color = dot % 3 === 0 ? "#7185ff" : dot % 3 === 1 ? "#ed9a69" : "#8db88b"; return <circle key={dot} cx={x} cy={y} r={4 + (dot % 3)} fill={color} fillOpacity=".85" />; })}<rect x="559" y="88" width="155" height="72" fill="var(--bg)" stroke="var(--line)"/><text x="578" y="117" fill="var(--muted)" fontSize="11" fontFamily="monospace">MODEL CONFIDENCE</text><text x="578" y="145" fill="var(--fg)" fontSize="22" fontFamily="monospace">87.4%</text></g>}
    {index === 2 && <g><rect x="64" y="56" width="672" height="438" rx="8" fill="#f4f1e8"/><rect x="64" y="56" width="672" height="48" rx="8" fill="#fffdf7"/><path d="M64 104h672" stroke="#d9d4c8"/><circle cx="84" cy="80" r="5" fill="#d79048"/><circle cx="101" cy="80" r="5" fill="#d9d4c8"/><circle cx="118" cy="80" r="5" fill="#d9d4c8"/><text x="148" y="86" fill="#554a39" fontSize="13" fontWeight="700" fontFamily="sans-serif" letterSpacing="1.5">AMTUL NOOR LIBRARY</text><rect x="82" y="122" width="636" height="90" rx="5" fill="#153e37"/><text x="104" y="151" fill="#d9e8d9" fontSize="11" fontFamily="sans-serif" letterSpacing="1.8">MEMBER PORTAL · READING ROOM</text><text x="104" y="184" fill="#fffdf7" fontSize="24" fontWeight="600" fontFamily="serif">A quieter place to focus.</text><rect x="594" y="150" width="99" height="34" rx="17" fill="#d9ae72"/><text x="614" y="172" fill="#153e37" fontSize="11" fontWeight="700" fontFamily="sans-serif">Join the library</text><text x="84" y="244" fill="#736f65" fontSize="10" fontFamily="sans-serif" letterSpacing="1.2">MEMBER DASHBOARD</text><rect x="82" y="259" width="194" height="84" rx="5" fill="#fffdf7" stroke="#e0dbd0"/><rect x="290" y="259" width="194" height="84" rx="5" fill="#fffdf7" stroke="#e0dbd0"/><rect x="498" y="259" width="220" height="84" rx="5" fill="#fffdf7" stroke="#e0dbd0"/><text x="100" y="283" fill="#817b70" fontSize="10" fontFamily="sans-serif">YOUR SEAT</text><text x="100" y="320" fill="#153e37" fontSize="22" fontWeight="700" fontFamily="sans-serif">A — 08</text><text x="308" y="283" fill="#817b70" fontSize="10" fontFamily="sans-serif">NEXT FEE DUE</text><text x="308" y="320" fill="#153e37" fontSize="22" fontWeight="700" fontFamily="sans-serif">₹ 1,200</text><text x="516" y="283" fill="#817b70" fontSize="10" fontFamily="sans-serif">MEMBERSHIP</text><rect x="516" y="302" width="82" height="23" rx="11" fill="#e4eee2"/><text x="533" y="318" fill="#347253" fontSize="10" fontWeight="700" fontFamily="sans-serif">ACTIVE</text><text x="84" y="375" fill="#736f65" fontSize="10" fontFamily="sans-serif" letterSpacing="1.2">PAYMENT HISTORY</text><rect x="82" y="389" width="636" height="76" rx="5" fill="#fffdf7" stroke="#e0dbd0"/><path d="M102 413h115m-115 25h154m85-25h106m-106 25h84" stroke="#bcb7ac" strokeWidth="5" strokeLinecap="round"/><circle cx="676" cy="427" r="13" fill="#e4eee2"/><path d="m670 427 4 4 8-9" fill="none" stroke="#347253" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>}
    {index === 3 && <g><rect x="64" y="56" width="672" height="438" rx="8" fill="#101114" stroke="#41434a"/><rect x="64" y="56" width="672" height="43" rx="8" fill="#191a1f"/><path d="M64 99h672" stroke="#34363d"/><circle cx="84" cy="77" r="5" fill="#ff6b5e"/><circle cx="101" cy="77" r="5" fill="#e8bf4a"/><circle cx="118" cy="77" r="5" fill="#61c454"/><rect x="260" y="68" width="290" height="18" rx="9" fill="#101114"/><text x="278" y="81" fill="#9a9ba4" fontSize="8" fontFamily="monospace">mohammadumar.dev</text><text x="92" y="147" fill="#a5a6b0" fontSize="10" fontFamily="monospace" letterSpacing="1.5">PORTFOLIO / 2026</text><text x="92" y="219" fill="#f0f0ed" fontSize="53" fontWeight="600" fontFamily="sans-serif" letterSpacing="-3">Mohammad</text><text x="92" y="274" fill="#f0f0ed" fontSize="53" fontWeight="600" fontFamily="sans-serif" letterSpacing="-3">Umar<tspan fill="#7185ff">.</tspan></text><text x="94" y="306" fill="#a5a6b0" fontSize="14" fontFamily="sans-serif">Computer Science undergraduate · B.Tech CSE ’27</text><text x="94" y="354" fill="#f0f0ed" fontSize="17" fontWeight="600" fontFamily="serif">Engineering ideas into experiences.</text><path d="M94 376h342" stroke="#393a42"/><text x="94" y="405" fill="#a5a6b0" fontSize="11" fontFamily="sans-serif">I build useful software across web and machine learning.</text><rect x="94" y="431" width="102" height="34" rx="17" fill="#7185ff"/><text x="115" y="453" fill="#101114" fontSize="10" fontWeight="700" fontFamily="sans-serif">Explore work ↗</text><circle cx="619" cy="274" r="89" fill="#171922" stroke="#383a44"/><circle cx="619" cy="274" r="66" fill="none" stroke="#424655" transform="rotate(-24 619 274)"/><circle cx="619" cy="274" r="44" fill="none" stroke="#424655" transform="rotate(34 619 274)"/><circle cx="619" cy="193" r="5" fill="#7185ff"/><text x="619" y="285" textAnchor="middle" fill="#eeeee8" fontSize="29" fontWeight="700" fontFamily="serif" letterSpacing="-4">MU</text></g>}
  </svg>;
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("mu-theme") || "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(pageFromHash);
  const [selected, setSelected] = useState(null);
  const [formState, setFormState] = useState("idle");
  const [notificationSent, setNotificationSent] = useState(false);
  const [formNotice, setFormNotice] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi! I’m Umar AI, a profile-based guide. Ask about projects, skills, education, or experience." }]);
  const [chatMinimized, setChatMinimized] = useState(false);

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("mu-theme", theme); window.dispatchEvent(new Event("themechange")); }, [theme]);
  useEffect(() => {
    const sections = nav.map(([, id]) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-22% 0px -58% 0px", threshold: [0, .15, .35, .6] });
    sections.forEach((section) => observer.observe(section));
    const initial = pageFromHash();
    if (initial !== "home") requestAnimationFrame(() => document.getElementById(initial)?.scrollIntoView({ block: "start" }));
    const syncHash = () => { setMenuOpen(false); const id = pageFromHash(); if (id !== "home") document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
    window.addEventListener("hashchange", syncHash);
    return () => { observer.disconnect(); window.removeEventListener("hashchange", syncHash); };
  }, []);
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") { setSelected(null); setChatOpen(false); setMenuOpen(false); } };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  useEffect(() => { document.body.style.overflow = selected || menuOpen || chatOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [selected, menuOpen, chatOpen]);

  const goTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
    if (pageFromHash() !== id) window.history.replaceState(null, "", `#/${id}`);
  };
  const submitContact = async (event) => {
    event.preventDefault(); setFormState("sending");
      const formNode = event.currentTarget;
    const form = new FormData(formNode);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || ""}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), message: form.get("message"), topic: form.get("topic"), website: form.get("website"), turnstileToken: form.get("cf-turnstile-response") }) });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Contact service unavailable");
      }
      const result = await response.json();
      setNotificationSent(Boolean(result.emailSent)); setFormNotice(""); setFormState("sent"); formNode.reset();
    } catch (error) { setFormNotice(error.message || "Couldn’t send right now. Please try again in a moment."); setFormState("error"); }
  };
  const getUmarAnswer = (raw) => {
    const q = raw.toLowerCase();
    if (/who are you|your name|are you (an? )?(ai|bot|human)/.test(q)) return "I’m Umar AI, a profile-based assistant on Mohammad Umar’s portfolio. I’m not Umar himself; I answer questions about his professional journey.";
    if (/project|studyvault|library|amtul|predictor|academicai|portfolio/.test(q)) return "Umar's projects include StudyVault, a student performance prediction app, Amtul Noor Library's full-stack management platform, and this portfolio. Open a project case study for details and live/source links.";
    if (/skill|stack|technology|technologies|know/.test(q)) return "His toolkit includes C++, JavaScript, Python, React, Next.js, Tailwind CSS, Node.js, Express, Firebase, and machine-learning tools such as Pandas, NumPy, and scikit-learn.";
    if (/study|education|university|college|degree/.test(q)) return "Umar is pursuing a B.Tech in Computer Science and Engineering, graduating in 2027.";
    if (/servicenow|service now|bangmetric/.test(q)) return "Umar has been placed at Bangmetric and is currently learning ServiceNow, the platform Bangmetric works with.";
    if (/intern|experience|novanectar|internpe/.test(q)) return "Umar completed a Frontend Developer internship at NovaNectar (June–September 2025), a C++ Programming internship at InternPe (May–July 2026), and a four-week Python Programming internship at InternPe.";
    if (/available|hire|opportunit/.test(q)) return "Umar is open to internships and collaborations. Use the contact form near the bottom of the page to get in touch.";
    if (/contact|email|reach/.test(q)) return "Use the contact form near the bottom of the page to send Umar a message.";
    if (/interest|curious|like/.test(q)) return "His interests are full-stack development, AI and machine learning, and problem solving.";
    if (/leetcode|problem|dsa|algorithm/.test(q)) return "Umar has solved 150+ LeetCode problems and regularly practices data structures and algorithms in C++.";
    return "I can answer questions about Umar’s projects, education, internships, skills, interests, and contact details. What would you like to know?";
  };
  const submitQuestion = (raw) => {
    const clean = raw.trim();
    if (!clean) return;
    setMessages((previous) => [...previous, { role: "user", text: clean }, { role: "assistant", text: getUmarAnswer(clean) }]);
    setQuestion("");
  };
  const askUmar = (event) => { event.preventDefault(); submitQuestion(question); };
  const newChat = () => { setMessages([{ role: "assistant", text: "Hi! I’m Umar AI, a profile-based guide. Ask about projects, skills, education, or experience." }]); setQuestion(""); };

  return <MotionConfig reducedMotion="user"><div className="portfolio min-h-screen">
    <CursorEffects />
    <div className="site-intro" aria-hidden="true"><span>MU</span></div>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-nav"><div className="nav-inner">
      <a href="#/home" className="brand" aria-label="Mohammad Umar, home" data-cursor="link"><BrandMark /><span>Mohammad Umar</span></a>
      <nav className="main-nav hidden items-center gap-8 xl:flex" aria-label="Main navigation">{nav.map(([label, id]) => <a key={id} className={`nav-link ${active === id ? "is-active" : ""}`} href={`#/${id}`} onClick={() => goTo(id)} aria-current={active === id ? "page" : undefined}>{label}</a>)}</nav>
      <div className="nav-actions"><button className="assistant-nav-trigger assistant-nav-compact magnetic" onClick={() => { setChatOpen(true); setChatMinimized(false); }} aria-haspopup="dialog" aria-expanded={chatOpen} aria-label="Open Ask Umar AI" data-cursor="link"><span className="assistant-nav-spark" aria-hidden="true">✳</span><span className="assistant-label-full">Ask Umar AI</span><span className="assistant-label-short">Ask AI</span></button><button className="icon-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? "☼" : "◐"}</button><button className="menu-toggle xl:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}><span className="menu-lines" aria-hidden="true" /></button></div>
    </div></header>
    <AnimatePresence>{menuOpen && <motion.nav className="mobile-menu xl:hidden" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} aria-label="Mobile navigation">{nav.map(([label, id], i) => <a key={id} style={{ "--i": i }} href={`#/${id}`} onClick={() => goTo(id)} aria-current={active === id ? "page" : undefined}>{label}<Arrow diagonal /></a>)}</motion.nav>}</AnimatePresence>
    <main id="main">
      <section id="home" className="hero wrap section-shell" aria-label="Introduction"><div className="hero-heading"><h1 aria-label="Mohammad Umar"><span className="hero-line"><span>Mohammad</span></span><span className="hero-line"><span className="hero-accent">Umar.</span></span></h1><div className="sculpture"><HeroSculpture /></div><p className="hero-role">Computer Science undergraduate <span>/</span> B.Tech CSE ’27</p></div>
        <div className="hero-kicker"><span className="availability-dot" /><a className="hero-status" href="#/contact" onClick={(event) => { event.preventDefault(); goTo("contact"); }}>Open to internships and collaborations <Arrow diagonal /></a></div>
        <div className="hero-bottom"><div className="hero-intro"><p className="hero-tagline">Engineering ideas into experiences.</p><p>I build clear, useful software across web development and machine learning—from student tools to real-world platforms.</p><div className="hero-actions"><a className="button button-primary magnetic" href="#/projects" onClick={(event) => { event.preventDefault(); goTo("projects"); }}>Explore my work <Arrow /></a><button className="button magnetic" type="button" onClick={() => { setChatOpen(true); setChatMinimized(false); }}>Ask Umar AI</button></div></div><aside className="hero-side"><dl><div><dt>Projects</dt><dd>04 <span>web + ML</span></dd></div><div><dt>Internships</dt><dd>03 <span>hands-on roles</span></dd></div><div><dt>Problem solving</dt><dd>150+ <span>LeetCode problems</span></dd></div></dl></aside></div>
      </section>

      <section id="about" className="section-shell wrap"><SectionTitle eyebrow="About">Curiosity drives what I build.</SectionTitle><div className="about-grid"><aside className="about-side"><p className="mono-label">Selected details</p><dl><div><dt>Degree</dt><dd>B.Tech in Computer Science and Engineering</dd></div><div><dt>Interests</dt><dd>Full-stack, AI and ML, problem solving</dd></div></dl></aside><div className="about-main"><div className="statement"><p>I’m a Computer Science undergraduate who enjoys exploring how technology works and using that understanding to create useful products.</p><p>My interests are full-stack development, AI and machine learning, and problem solving.</p></div><div className="principles"><article><span>01</span><h3>Technical foundation</h3><p>Building a strong base in data structures, algorithms, object-oriented programming, and full-stack development.</p></article><article><span>02</span><h3>Currently learning</h3><p>I’ve been placed at Bangmetric and am currently learning ServiceNow, the platform Bangmetric works with.</p></article><article><span>03</span><h3>How I work</h3><p>I like turning real needs into clear, reliable software and learning by shipping useful things.</p></article></div></div></div></section>

      <section id="projects" className="section-shell work-section"><div className="wrap"><div className="projects-heading"><SectionTitle eyebrow="Selected projects">Four projects across web development, machine learning, and product design.</SectionTitle><p>Open any of them for the case study.</p></div><div className="projects-list">{projects.map((project, index) => <motion.article className="project-row" key={project.name} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.75, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}><button className={`project-art art-${index + 1}`} onClick={() => setSelected(index)} aria-label={`Open ${project.name} case study`} data-cursor="view"><ProjectArtwork index={index} title={project.name} /><span className="art-caption">PROJECT / {String(index + 1).padStart(2, "0")}</span><span className="art-arrow"><Arrow diagonal /></span></button><div className="project-info"><div className="project-meta"><span className="proj-num">{String(index + 1).padStart(2, "0")}</span><span>{project.kind}</span></div><button className="project-title" onClick={() => setSelected(index)} data-cursor="view">{project.name}<Arrow diagonal /></button><p>{project.description}</p><ul className="tag-list">{project.stack.map((tag) => <li key={tag}>{tag}</li>)}</ul><div className="project-link-row"><a href={project.github} target="_blank" rel="noreferrer">Source code <Arrow diagonal /></a><a href={project.href} target="_blank" rel="noreferrer">Live project <Arrow diagonal /></a></div><button className="project-open" onClick={() => setSelected(index)} data-cursor="view">View case study <Arrow /></button></div></motion.article>)}</div></div></section>

      <section id="experience" className="section-shell wrap"><SectionTitle eyebrow="Experience and education">Learning by building.</SectionTitle><div className="journey-grid"><div className="timeline"><motion.article initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .65 }}><time>May – Jul 2026</time><div><h3>C++ Programming Intern</h3><p className="timeline-org">InternPe</p><p className="body-copy">Internship focused on C++ programming and problem solving.</p></div></motion.article><motion.article initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .65, delay: .1 }}><time>Jun – Sep 2025</time><div><h3>Frontend Developer Intern</h3><p className="timeline-org">NovaNectar</p><p className="body-copy">Internship focused on frontend development with HTML, CSS, and JavaScript.</p></div></motion.article><motion.article initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .65, delay: .2 }}><time>Four weeks</time><div><h3>Python Programming Intern</h3><p className="timeline-org">InternPe</p><p className="body-copy">Four-week internship focused on Python programming.</p></div></motion.article></div><aside className="education-card"><Eyebrow>Education</Eyebrow><p className="edu-degree">B.Tech, Computer Science and Engineering</p></aside></div></section>

      <section id="skills" className="section-shell wrap skills-section"><SectionTitle eyebrow="Technical expertise">The tools I think with.</SectionTitle><div className="skills-list">{groups.map(([label, ...skills], index) => <motion.div className="skill-row" key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .55, delay: index * .05 }}><h3>{label}</h3><ul>{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></motion.div>)}</div></section>

      <section id="achievements" className="section-shell wrap proof-section"><motion.div className="proof-big" initial={{ opacity: 0, scale: .92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .85 }}><span>150</span><span className="proof-plus">+</span><p>LeetCode problems<br />solved</p></motion.div><div className="proof-content"><Eyebrow>Achievements and learning</Eyebrow><h2 className="section-title">Practice, every day.</h2><div className="proof-list"><article><span>01</span><div><h3>DSA practice in C++</h3><p>Regular problem solving across core data structures and algorithms.</p></div></article><article><span>02</span><div><h3>Technical certifications</h3><p>Courses completed alongside university coursework.</p></div></article><article><span>03</span><div><h3>Hackathon participation</h3><p>Building and shipping ideas against the clock with other students.</p></div></article><article><span>04</span><div><h3>Continuous learning</h3><p>Always working through the next framework, concept, or problem set.</p></div></article></div></div></section>

      <section id="contact" className="contact-section"><div className="wrap"><Eyebrow>06 / Start a conversation</Eyebrow><h2 className="contact-title">Have an idea<br />worth building<span className="accent-dot">?</span></h2><div className="contact-grid"><div><p className="contact-lead">I’m interested in meaningful projects, thoughtful technical challenges, and opportunities to learn and collaborate.</p><a className="social-link" href="https://github.com/umar24nov" target="_blank" rel="noreferrer">Find me on GitHub <Arrow diagonal /></a></div><form className="contact-form" onSubmit={submitContact}><input className="contact-honey" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" /><label>Your name<input name="name" autoComplete="name" required maxLength="80" placeholder="What should I call you?" /></label><label>Email address<input type="email" name="email" autoComplete="email" required maxLength="160" placeholder="you@example.com" /></label><label>What’s on your mind?<select name="topic"><option>Project idea</option><option>Internship opportunity</option><option>Collaboration</option><option>Just saying hello</option></select></label><label>Message<textarea name="message" rows="4" required minLength="10" maxLength="4000" placeholder="A little context goes a long way…" /></label>{process.env.REACT_APP_TURNSTILE_SITE_KEY && <div className="cf-turnstile" data-sitekey={process.env.REACT_APP_TURNSTILE_SITE_KEY} data-theme="auto" />}<div className="form-bottom"><button className="button button-primary" type="submit" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Send a message"}<Arrow /></button><p role="status" className={`form-status ${formState}`}>{formState === "sent" ? notificationSent ? "Thanks — your message was saved and sent to my inbox." : "Thanks — your message was received." : formState === "error" ? formNotice : "I’ll follow up using your email address."}</p></div></form></div></div></section>
    </main>
    <footer className="site-footer wrap" aria-label="Portfolio footer"><a className="brand" href="#/home" onClick={(event) => { event.preventDefault(); goTo("home"); }}><BrandMark /><span>Mohammad Umar</span></a></footer><a className="floating-contact" href="#/contact" onClick={(event) => { event.preventDefault(); goTo("contact"); }}>Get in touch <Arrow diagonal /></a>
    <AnimatePresence>{chatOpen && <motion.div className="assistant-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setChatOpen(false); }}><motion.section className={`assistant-panel ${chatMinimized ? "is-minimized" : ""}`} initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }} role="dialog" aria-modal="true" aria-labelledby="assistant-title"><div className="assistant-head"><div><p className="mono-label">Profile-based demo</p><h2 id="assistant-title">Umar AI</h2></div><div className="assistant-controls"><button className="icon-button" onClick={newChat} aria-label="Start a new chat">↻</button><button className="icon-button" onClick={() => setChatMinimized(!chatMinimized)} aria-label={chatMinimized ? "Expand assistant" : "Minimize assistant"}>{chatMinimized ? "+" : "−"}</button><button className="icon-button" onClick={() => setChatOpen(false)} aria-label="Close assistant">×</button></div></div>{!chatMinimized && <><div className="assistant-messages" aria-live="polite">{messages.map((message, index) => <p key={`${index}-${message.role}`} className={`assistant-message ${message.role}`}>{message.text}</p>)}</div><div className="assistant-prompts">{["What projects have you built?", "Tell me about your education", "What skills do you use?", "What is your experience?"].map((prompt) => <button key={prompt} onClick={() => submitQuestion(prompt)}>{prompt}</button>)}</div><form className="assistant-form" onSubmit={askUmar}><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about Umar…" maxLength={240} aria-label="Ask about Umar" /><button aria-label="Send question"><Arrow /></button></form><p className="assistant-note">Demo mode · Answers are based on the portfolio profile.</p></>}</motion.section></motion.div>}</AnimatePresence>
    <AnimatePresence>{selected !== null && <motion.div className="case-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}><motion.article className="case-panel" initial={{ y: 42, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 28, opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="case-title"><div className="case-top"><span className="mono-label">Case study · {String(selected + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close case study">×</button></div><div className={`case-visual art-${selected + 1}`}><ProjectArtwork index={selected} title={projects[selected].name} /></div><Eyebrow>{projects[selected].kind}</Eyebrow><h2 id="case-title" className="case-title">{projects[selected].name}</h2><div className="case-copy"><div><h3>Overview</h3><p>{projects[selected].details}</p></div><div><h3>Highlights</h3><ul>{projects[selected].features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><div><h3>Built with</h3><ul className="tag-list">{projects[selected].stack.map((tag) => <li key={tag}>{tag}</li>)}</ul></div></div><div className="case-links"><a className="text-link" href={projects[selected].github} target="_blank" rel="noreferrer">GitHub profile <Arrow diagonal /></a>{projects[selected].href.startsWith("http") && <a className="text-link" href={projects[selected].href} target="_blank" rel="noreferrer">Visit project <Arrow diagonal /></a>}</div><button className="case-next" onClick={() => setSelected((selected + 1) % projects.length)}>Next project <Arrow /></button></motion.article></motion.div>}</AnimatePresence>
  </div></MotionConfig>;
}
