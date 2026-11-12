import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";

const projects = [
  { name: "StudyVault", kind: "Academic resource platform", year: "2025", stack: ["React", "Express", "Firebase", "Cloudinary"], description: "A place for students to discover, share, rate, and download useful academic resources.", details: "StudyVault brings course material into one searchable library. Students can sign in, upload resources, browse what others have shared, and rate or download material.", features: ["Authentication and protected flows", "Resource uploads and discovery", "Ratings and downloads"], href: "https://studyvaultapp.vercel.app/", github: "https://github.com/umar24nov" },
  { name: "Student Performance Predictor", kind: "Machine learning", year: "2025", stack: ["Python", "Pandas", "NumPy", "Scikit-learn"], description: "An academic forecasting project that explores student outcomes through data and machine learning.", details: "The project covers data cleaning, feature analysis, model training, and evaluation to predict student performance categories and surface learners who may need support.", features: ["Data preprocessing and exploration", "Feature analysis", "Model comparison and evaluation"], href: "https://academic-ai.onrender.com", github: "https://github.com/umar24nov" },
  { name: "Zenrix", kind: "EdTech product concept", year: "In progress", stack: ["Product design", "Next.js", "TypeScript"], description: "A considered product concept for bringing coaching workflows into one focused learning space.", details: "Zenrix explores a shared workspace for coaching institutes, educators, and students. The concept is being shaped around clear learning workflows and a calm, useful interface.", features: ["Education-first product direction", "Student and educator workflows", "Early stage concept"], href: "#contact", github: "https://github.com/umar24nov" },
  { name: "Personal Portfolio", kind: "Digital identity", year: "2026", stack: ["React", "Tailwind CSS", "Express", "Cloudflare"], description: "A new portfolio experience designed around the work, the thinking, and the journey behind it.", details: "This portfolio brings together project case studies, learning milestones, and a direct way to start a conversation. Built to grow alongside the work.", features: ["Responsive editorial design", "Accessible motion and theme controls", "Cloudflare-ready contact API"], href: "#home", github: "https://github.com/umar24nov" },
];
const groups = [
  ["Programming", "C++", "JavaScript", "Python"],
  ["Frontend", "HTML", "CSS", "JavaScript", "React", "Next.js", "Tailwind CSS"],
  ["Backend", "Node.js", "Express.js", "REST APIs"],
  ["AI and ML", "Python", "Pandas", "NumPy", "Scikit-learn"],
  ["Tools", "Git", "GitHub", "Firebase", "Cloudinary", "Cloudflare"],
  ["Core concepts", "Data Structures and Algorithms", "OOP", "DBMS", "Computer Networks"],
];
const nav = [["Home", "home"], ["About", "about"], ["Projects", "projects"], ["Experience", "experience"], ["Skills", "skills"], ["Contact", "contact"]];
const validPages = new Set([...nav.map(([, id]) => id), "achievements"]);
const pageFromHash = () => {
  const page = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return validPages.has(page) ? page : "home";
};

function Arrow({ diagonal = false }) { return <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none"><path d={diagonal ? "M5 15 15 5M6 5h9v9" : "M3 10h13m-5-5 5 5-5 5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function Eyebrow({ children }) { return <p className="eyebrow">{children}</p>; }
function SectionTitle({ eyebrow, children, id }) { return <div className="mb-14 md:mb-20"><Eyebrow>{eyebrow}</Eyebrow><motion.h2 id={id} className="section-title mt-5" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.h2></div>; }

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
  return <svg className="project-artwork" viewBox="0 0 800 550" role="img" aria-label={`${title} project illustration`}>
    <defs><pattern id={`grid-${index}`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" strokeOpacity=".12" /></pattern><linearGradient id={`glow-${index}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--accent)" stopOpacity=".24" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
    <rect width="800" height="550" fill="var(--surface)" /><rect width="800" height="550" fill={`url(#grid-${index})`} /><rect width="800" height="550" fill={`url(#glow-${index})`} />
    {index === 0 && <g><rect x="56" y="58" width="688" height="434" rx="3" fill="var(--bg)" stroke="var(--line)"/><path d="M56 100h688" stroke="var(--line)"/><circle cx="78" cy="80" r="5" fill="var(--accent)"/><circle cx="96" cy="80" r="5" fill="var(--line)"/><rect x="80" y="125" width="460" height="28" fill="var(--surface)"/><text x="96" y="145" fill="var(--muted)" fontSize="13" fontFamily="monospace">STUDYVAULT / RESOURCE LIBRARY</text>{[0,1,2].map((row) => <g key={row}><rect x="80" y={180 + row * 88} width="462" height="68" fill="var(--bg)" stroke="var(--line)"/><rect x="96" y={196 + row * 88} width="32" height="40" fill="var(--surface)" stroke="var(--line)"/><path d={`M143 ${202 + row * 88}h210M143 ${218 + row * 88}h162`} stroke="var(--muted)" strokeOpacity=".55"/><circle cx="468" cy={214 + row * 88} r="5" fill="var(--accent)"/></g>)}<rect x="570" y="125" width="146" height="286" fill="var(--surface)" stroke="var(--line)"/><circle cx="643" cy="190" r="22" fill="var(--accent)"/><path d="M643 180v20m-10-10h20" stroke="var(--accent-ink)" strokeWidth="2"/><text x="591" y="246" fill="var(--fg)" fontSize="14" fontFamily="monospace">UPLOAD NOTES</text><path d="M592 268h96M592 285h82M592 302h90" stroke="var(--muted)" strokeOpacity=".45"/></g>}
    {index === 1 && <g><path d="M102 452V94M102 452h600" fill="none" stroke="var(--fg)" strokeOpacity=".65"/><text x="405" y="505" textAnchor="middle" fill="var(--muted)" fontSize="13" fontFamily="monospace">STUDENT FEATURE SPACE</text><path d="M112 414C228 401 261 325 342 307s117-116 204-136 95-64 148-78" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 8"/>{Array.from({ length: 54 }, (_, dot) => { const x = 132 + ((dot * 71) % 540); const y = 130 + ((dot * 97) % 280); const color = dot % 3 === 0 ? "#7185ff" : dot % 3 === 1 ? "#ed9a69" : "#8db88b"; return <circle key={dot} cx={x} cy={y} r={4 + (dot % 3)} fill={color} fillOpacity=".85" />; })}<rect x="559" y="88" width="155" height="72" fill="var(--bg)" stroke="var(--line)"/><text x="578" y="117" fill="var(--muted)" fontSize="11" fontFamily="monospace">MODEL CONFIDENCE</text><text x="578" y="145" fill="var(--fg)" fontSize="22" fontFamily="monospace">87.4%</text></g>}
    {index === 2 && <g><rect x="65" y="64" width="670" height="420" fill="var(--bg)" stroke="var(--line)"/><path d="M65 112h670M210 112v372" stroke="var(--line)"/><text x="88" y="94" fill="var(--fg)" fontSize="17" fontFamily="monospace">ZENRIX / LEARNING SPACE</text>{[0,1,2,3].map((row) => <g key={row}><rect x="84" y={140 + row * 76} width="106" height="50" fill="var(--surface)"/><circle cx="104" cy={165 + row * 76} r="8" fill="var(--accent)"/><path d={`M123 ${159 + row * 76}h48m-48 12h34`} stroke="var(--muted)"/></g>)}<text x="244" y="151" fill="var(--muted)" fontSize="12" fontFamily="monospace">YOUR LEARNING OVERVIEW</text><rect x="244" y="171" width="445" height="102" fill="var(--surface)" stroke="var(--line)"/><path d="M271 243l63-38 62 17 64-36 63 19 60-39 73 10" fill="none" stroke="var(--accent)" strokeWidth="3"/><rect x="244" y="294" width="208" height="156" fill="var(--surface)" stroke="var(--line)"/><rect x="468" y="294" width="221" height="156" fill="var(--surface)" stroke="var(--line)"/><path d="M270 332h154m-154 25h132m-132 25h146m-146 25h101" stroke="var(--muted)" strokeOpacity=".5"/><circle cx="522" cy="357" r="31" fill="none" stroke="var(--line)" strokeWidth="11"/><path d="M522 326a31 31 0 0 1 29 41" fill="none" stroke="var(--accent)" strokeWidth="11"/></g>}
    {index === 3 && <g><circle cx="400" cy="275" r="188" fill="none" stroke="var(--line)"/><ellipse cx="400" cy="275" rx="270" ry="90" fill="none" stroke="var(--line)" transform="rotate(-28 400 275)"/><ellipse cx="400" cy="275" rx="270" ry="90" fill="none" stroke="var(--line)" transform="rotate(32 400 275)"/><text x="400" y="321" textAnchor="middle" fill="var(--fg)" fontSize="168" fontWeight="700" fontFamily="serif" letterSpacing="-20">MU</text><circle cx="241" cy="132" r="8" fill="var(--accent)"/><circle cx="646" cy="327" r="6" fill="var(--accent)"/><circle cx="175" cy="361" r="4" fill="var(--fg)"/></g>}
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
    const syncPage = () => { setActive(pageFromHash()); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "auto" }); };
    window.addEventListener("hashchange", syncPage);
    return () => window.removeEventListener("hashchange", syncPage);
  }, []);
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") { setSelected(null); setChatOpen(false); setMenuOpen(false); } };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  useEffect(() => { document.body.style.overflow = selected || menuOpen || chatOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [selected, menuOpen, chatOpen]);

  const goTo = (id) => { setMenuOpen(false); if (id !== active) window.location.hash = `/${id}`; };
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
    if (/project|studyvault|zenrix|predictor|academicai/.test(q)) return "Umar has built StudyVault, a student resource-sharing platform, a student performance prediction project using machine learning, and the Zenrix EdTech concept. Open a project case study for its details.";
    if (/skill|stack|technology|technologies|know/.test(q)) return "His toolkit includes C++, JavaScript, Python, React, Next.js, Tailwind CSS, Node.js, Express, Firebase, and machine-learning tools such as Pandas, NumPy, and scikit-learn.";
    if (/study|education|university|college|degree|cgpa|gpa/.test(q)) return "Umar is pursuing a B.Tech in Computer Science and Engineering at COER University, from 2023 to 2027. His CGPA is 7.9/10.";
    if (/intern|experience|novanectar|internpe/.test(q)) return "Umar completed a Frontend Developer internship at NovaNectar (June–September 2025), a C++ Programming internship at InternPe (May–July 2026), and a four-week Python Programming internship at InternPe.";
    if (/available|hire|opportunit/.test(q)) return "Umar is open to internships and collaborations. Use the contact form on the Contact page to get in touch.";
    if (/contact|email|reach/.test(q)) return "Use the contact form on the Contact page to send Umar a message.";
    if (/interest|curious|like/.test(q)) return "His interests include frontend engineering, full-stack development, artificial intelligence and machine learning, data structures and algorithms, software engineering, and cybersecurity.";
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
      <div className="nav-actions"><button className="assistant-nav-trigger assistant-nav-compact magnetic" onClick={() => { setChatOpen(true); setChatMinimized(false); }} aria-haspopup="dialog" aria-expanded={chatOpen} aria-label="Open Ask Umar AI" data-cursor="link"><span className="assistant-nav-spark" aria-hidden="true">✳</span><span className="assistant-label-full">Ask Umar AI</span><span className="assistant-label-short">Ask AI</span></button><button className="icon-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? "☼" : "◐"}</button><button className="menu-toggle xl:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? "Close" : "Menu"}<span className="menu-lines" /></button></div>
    </div></header>
    <AnimatePresence>{menuOpen && <motion.nav className="mobile-menu xl:hidden" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} aria-label="Mobile navigation">{nav.map(([label, id], i) => <a key={id} style={{ "--i": i }} href={`#/${id}`} onClick={() => goTo(id)} aria-current={active === id ? "page" : undefined}>{label}<Arrow diagonal /></a>)}</motion.nav>}</AnimatePresence>
    <main id="main">
      <section id="home" className="hero wrap section-shell" aria-label="Introduction" style={{ display: active === "home" ? undefined : "none" }}><div className="hero-kicker"><span className="availability-dot" /><span className="hero-name"><b>Mohammad Umar</b></span><span className="hero-divider">/</span><span>Computer Science Undergraduate</span><span className="hero-divider">/</span><span className="hero-place">B.Tech CSE ’27</span><a className="hero-status" href="#/contact" onClick={() => goTo("contact")}>Open to internships and collaborations <Arrow diagonal /></a></div>
        <div className="hero-heading"><h1 aria-label="Engineering ideas into experiences."><span className="hero-line"><span>Engineering</span></span><span className="hero-line"><span>ideas into</span></span><span className="hero-line"><span className="hero-accent">experiences.</span></span></h1><div className="sculpture"><HeroSculpture /></div></div>
        <div className="hero-bottom"><div className="hero-intro"><p>I build crisp interfaces, full-stack products, and practical machine-learning experiments—turning real problems into software people can use.</p><div className="hero-actions"><a className="button button-primary magnetic" href="/resume.pdf" target="_blank" rel="noreferrer">View resume <Arrow diagonal /></a><button className="button magnetic" type="button" onClick={() => { setChatOpen(true); setChatMinimized(false); }}>Ask Umar AI</button></div></div><aside className="hero-side"><dl><div><dt>Selected projects</dt><dd>04 <span>web + ML</span></dd></div><div><dt>Internship roles</dt><dd>03 <span>industry experience</span></dd></div><div><dt>Problem solving</dt><dd>150+ <span>LeetCode solved</span></dd></div></dl></aside></div>
      </section>

      <section id="about" className="section-shell wrap" style={{ display: active === "about" ? undefined : "none" }}><SectionTitle eyebrow="About">Curiosity drives what I build.</SectionTitle><div className="about-grid"><aside className="about-side"><p className="mono-label">Selected details</p><dl><div><dt>Degree</dt><dd>B.Tech, Computer Science and Engineering</dd></div><div><dt>University</dt><dd>COER University</dd></div><div><dt>Batch</dt><dd>2023 – 2027</dd></div><div><dt>CGPA</dt><dd>7.9 / 10</dd></div><div><dt>Interests</dt><dd>Frontend, full-stack, AI and ML, problem solving</dd></div></dl></aside><div className="about-main"><div className="statement"><p>I’m a Computer Science undergraduate who enjoys exploring how technology works and using that understanding to create useful products.</p><p>My interests span frontend engineering, full-stack development, artificial intelligence, and problem-solving.</p><p>I believe great software is more than functional code. It is about understanding people, identifying problems, and designing solutions that are intuitive, reliable, and meaningful.</p></div><div className="principles"><article><span>01</span><h3>Academic background</h3><p>Pursuing a B.Tech at COER University, with coursework in data structures, algorithms, OOP, DBMS, and computer networks.</p></article><article><span>02</span><h3>Currently learning</h3><p>Next.js and TypeScript, machine learning with scikit-learn, and DSA practice in C++.</p></article><article><span>03</span><h3>Technical interests</h3><p>Frontend engineering, full-stack development, AI and machine learning, and thoughtful digital products.</p></article></div></div></div></section>

      <section id="projects" className="section-shell work-section" style={{ display: active === "projects" ? undefined : "none" }}><div className="wrap"><div className="projects-heading"><SectionTitle eyebrow="Selected projects">Four projects across web development, machine learning, and product design.</SectionTitle><p>Open any of them for the case study.</p></div><div className="projects-list">{projects.map((project, index) => <motion.article className="project-row" key={project.name} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.75, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}><button className={`project-art art-${index + 1}`} onClick={() => setSelected(index)} aria-label={`Open ${project.name} case study`} data-cursor="view"><ProjectArtwork index={index} title={project.name} /><span className="art-caption">PROJECT / {String(index + 1).padStart(2, "0")}</span><span className="art-arrow"><Arrow diagonal /></span></button><div className="project-info"><div className="project-meta"><span className="proj-num">{String(index + 1).padStart(2, "0")}</span><span>{project.kind}</span></div><button className="project-title" onClick={() => setSelected(index)} data-cursor="view">{project.name}<Arrow diagonal /></button><p>{project.description}</p><ul className="tag-list">{project.stack.map((tag) => <li key={tag}>{tag}</li>)}</ul><button className="project-open" onClick={() => setSelected(index)} data-cursor="view">View case study <Arrow /></button></div></motion.article>)}</div></div></section>

      <section id="experience" className="section-shell wrap" style={{ display: active === "experience" ? undefined : "none" }}><SectionTitle eyebrow="Experience and education">Learning by building.</SectionTitle><div className="journey-grid"><div className="timeline"><motion.article initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .65 }}><time>May – Jul 2026</time><div><h3>C++ Programming Intern</h3><p className="timeline-org">InternPe</p><p className="body-copy">Internship focused on C++ programming and problem solving.</p></div></motion.article><motion.article initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .65, delay: .1 }}><time>Jun – Sep 2025</time><div><h3>Frontend Developer Intern</h3><p className="timeline-org">NovaNectar</p><p className="body-copy">Internship focused on frontend development with HTML, CSS, and JavaScript.</p></div></motion.article><motion.article initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .65, delay: .2 }}><time>Four weeks</time><div><h3>Python Programming Intern</h3><p className="timeline-org">InternPe</p><p className="body-copy">Four-week internship focused on Python programming.</p></div></motion.article></div><aside className="education-card"><Eyebrow>Education</Eyebrow><p className="edu-degree">B.Tech, Computer Science and Engineering</p><p className="edu-school">COER University<br />2023 — 2027</p><div className="edu-rule" /><p className="edu-cgpa">7.9 <small>/ 10 CGPA</small></p></aside></div></section>

      <section id="skills" className="section-shell wrap skills-section" style={{ display: active === "skills" ? undefined : "none" }}><SectionTitle eyebrow="Technical expertise">The tools I think with.</SectionTitle><div className="skills-list">{groups.map(([label, ...skills], index) => <motion.div className="skill-row" key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .55, delay: index * .05 }}><h3>{label}</h3><ul>{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></motion.div>)}</div></section>

      <section id="achievements" className="section-shell wrap proof-section" style={{ display: active === "experience" ? undefined : "none" }}><motion.div className="proof-big" initial={{ opacity: 0, scale: .92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .85 }}><span>150</span><span className="proof-plus">+</span><p>LeetCode problems<br />solved</p></motion.div><div className="proof-content"><Eyebrow>Achievements and learning</Eyebrow><h2 className="section-title">Practice, every day.</h2><div className="proof-list"><article><span>01</span><div><h3>DSA practice in C++</h3><p>Regular problem solving across core data structures and algorithms.</p></div></article><article><span>02</span><div><h3>Technical certifications</h3><p>Courses completed alongside university coursework.</p></div></article><article><span>03</span><div><h3>Hackathon participation</h3><p>Building and shipping ideas against the clock with other students.</p></div></article><article><span>04</span><div><h3>Continuous learning</h3><p>Always working through the next framework, concept, or problem set.</p></div></article></div></div></section>

      <section id="contact" className="contact-section" style={{ display: active === "contact" ? undefined : "none" }}><div className="wrap"><Eyebrow>06 / Start a conversation</Eyebrow><h2 className="contact-title">Have an idea<br />worth building<span className="accent-dot">?</span></h2><div className="contact-grid"><div><p className="contact-lead">I’m interested in meaningful projects, thoughtful technical challenges, and opportunities to learn and collaborate.</p><a className="social-link" href="https://github.com/umar24nov" target="_blank" rel="noreferrer">Find me on GitHub <Arrow diagonal /></a></div><form className="contact-form" onSubmit={submitContact}><input className="contact-honey" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" /><label>Your name<input name="name" autoComplete="name" required maxLength="80" placeholder="What should I call you?" /></label><label>Email address<input type="email" name="email" autoComplete="email" required maxLength="160" placeholder="you@example.com" /></label><label>What’s on your mind?<select name="topic"><option>Project idea</option><option>Internship opportunity</option><option>Collaboration</option><option>Just saying hello</option></select></label><label>Message<textarea name="message" rows="4" required minLength="10" maxLength="4000" placeholder="A little context goes a long way…" /></label>{process.env.REACT_APP_TURNSTILE_SITE_KEY && <div className="cf-turnstile" data-sitekey={process.env.REACT_APP_TURNSTILE_SITE_KEY} data-theme="auto" />}<div className="form-bottom"><button className="button button-primary" type="submit" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Send a message"}<Arrow /></button><p role="status" className={`form-status ${formState}`}>{formState === "sent" ? notificationSent ? "Thanks — your message was saved and sent to my inbox." : "Thanks — your message was received." : formState === "error" ? formNotice : "I’ll follow up using your email address."}</p></div></form></div></div></section>
    </main>
    <footer className="site-footer wrap" aria-label="Portfolio footer"><div className="brand"><BrandMark /><span>Mohammad Umar</span></div><p><span className="footer-kicker">BUILDING IN THE OPEN</span><span>Software · full-stack · AI &amp; ML</span></p><a className="footer-github" href="https://github.com/umar24nov" target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a><span className="footer-year">© {new Date().getFullYear()}</span></footer>
    <AnimatePresence>{chatOpen && <motion.div className="assistant-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setChatOpen(false); }}><motion.section className={`assistant-panel ${chatMinimized ? "is-minimized" : ""}`} initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }} role="dialog" aria-modal="true" aria-labelledby="assistant-title"><div className="assistant-head"><div><p className="mono-label">Profile-based demo</p><h2 id="assistant-title">Umar AI</h2></div><div className="assistant-controls"><button className="icon-button" onClick={newChat} aria-label="Start a new chat">↻</button><button className="icon-button" onClick={() => setChatMinimized(!chatMinimized)} aria-label={chatMinimized ? "Expand assistant" : "Minimize assistant"}>{chatMinimized ? "+" : "−"}</button><button className="icon-button" onClick={() => setChatOpen(false)} aria-label="Close assistant">×</button></div></div>{!chatMinimized && <><div className="assistant-messages" aria-live="polite">{messages.map((message, index) => <p key={`${index}-${message.role}`} className={`assistant-message ${message.role}`}>{message.text}</p>)}</div><div className="assistant-prompts">{["What projects have you built?", "Tell me about your education", "What skills do you use?", "What is your experience?"].map((prompt) => <button key={prompt} onClick={() => submitQuestion(prompt)}>{prompt}</button>)}</div><form className="assistant-form" onSubmit={askUmar}><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about Umar…" maxLength={240} aria-label="Ask about Umar" /><button aria-label="Send question"><Arrow /></button></form><p className="assistant-note">Demo mode · Answers are based on the portfolio profile.</p></>}</motion.section></motion.div>}</AnimatePresence>
    <AnimatePresence>{selected !== null && <motion.div className="case-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}><motion.article className="case-panel" initial={{ y: 42, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 28, opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="case-title"><div className="case-top"><span className="mono-label">Case study · {String(selected + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close case study">×</button></div><div className={`case-visual art-${selected + 1}`}><span className="art-word">{projects[selected].name.split(" ")[0]}</span></div><Eyebrow>{projects[selected].kind}</Eyebrow><h2 id="case-title" className="case-title">{projects[selected].name}</h2><div className="case-copy"><div><h3>Overview</h3><p>{projects[selected].details}</p></div><div><h3>Highlights</h3><ul>{projects[selected].features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><div><h3>Built with</h3><ul className="tag-list">{projects[selected].stack.map((tag) => <li key={tag}>{tag}</li>)}</ul></div></div><div className="case-links"><a className="text-link" href={projects[selected].github} target="_blank" rel="noreferrer">GitHub profile <Arrow diagonal /></a>{projects[selected].href.startsWith("http") && <a className="text-link" href={projects[selected].href} target="_blank" rel="noreferrer">Visit project <Arrow diagonal /></a>}</div><button className="case-next" onClick={() => setSelected((selected + 1) % projects.length)}>Next project <Arrow /></button></motion.article></motion.div>}</AnimatePresence>
  </div></MotionConfig>;
}
