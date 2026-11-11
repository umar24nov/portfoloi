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

function Arrow({ diagonal = false }) { return <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none"><path d={diagonal ? "M5 15 15 5M6 5h9v9" : "M3 10h13m-5-5 5 5-5 5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function Eyebrow({ children }) { return <p className="eyebrow">{children}</p>; }
function SectionTitle({ eyebrow, children, id }) { return <div className="mb-14 md:mb-20"><Eyebrow>{eyebrow}</Eyebrow><motion.h2 id={id} className="section-title mt-5" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.h2></div>; }

function HeroSculpture() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const points = Array.from({ length: 560 }, (_, index) => {
      const y = 1 - (index / 559) * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = index * Math.PI * (3 - Math.sqrt(5));
      return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius, accent: index % 23 === 0 };
    });
    let width = 0; let height = 0; let pixelRatio = 1; let frame = 0; let pointerX = 0; let pointerY = 0;
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width; height = box.height;
      canvas.width = Math.round(width * pixelRatio); canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(performance.now());
    };
    const onPointer = (event) => { pointerX = (event.clientX / window.innerWidth - 0.5) * 0.65; pointerY = (event.clientY / window.innerHeight - 0.5) * 0.45; };
    const draw = (time) => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      const cx = width * 0.51; const cy = height * 0.5; const scale = Math.min(width, height) * 0.38;
      const t = reduced ? 0 : time * 0.00022;
      const yaw = t + pointerX; const pitch = Math.sin(t * 0.72) * 0.16 + pointerY;
      const cyaw = Math.cos(yaw); const syaw = Math.sin(yaw); const cp = Math.cos(pitch); const sp = Math.sin(pitch);
      const foreground = getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#eeeeea";
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#5470ff";
      for (const point of points) {
        const x = point.x * cyaw + point.z * syaw;
        const z = -point.x * syaw + point.z * cyaw;
        const y = point.y * cp - z * sp;
        const depth = point.y * sp + z * cp;
        const ripple = Math.sin(x * 5 + t * 2) + Math.cos(y * 4 - t * 1.7) + Math.sin(depth * 5 + t * 1.4);
        const perspective = 1.05 / (2.65 - depth);
        const px = cx + (x + x * ripple * 0.018) * scale * perspective;
        const py = cy + (y + y * ripple * 0.018) * scale * perspective;
        const dot = point.accent ? accent : foreground;
        context.globalAlpha = Math.max(0.14, 0.88 - (1 - depth) * 0.4);
        context.fillStyle = dot;
        const size = point.accent ? 2.1 : 1.15 + (depth + 1) * 0.45;
        context.beginPath(); context.arc(px, py, size, 0, Math.PI * 2); context.fill();
      }
      context.globalAlpha = 1;
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(resize); observer.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    resize();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("pointermove", onPointer); };
  }, []);
  return <canvas ref={canvasRef} className="sculpture-canvas" aria-hidden="true" />;
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
  const [active, setActive] = useState("home");
  const [selected, setSelected] = useState(null);
  const [formState, setFormState] = useState("idle");
  const [notificationSent, setNotificationSent] = useState(false);
  const [formNotice, setFormNotice] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi! I’m Umar AI, a profile-based guide. Ask about projects, skills, education, or experience." }]);
  const [chatMinimized, setChatMinimized] = useState(false);

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("mu-theme", theme); }, [theme]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: "-35% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") { setSelected(null); setChatOpen(false); setMenuOpen(false); } };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  useEffect(() => { document.body.style.overflow = selected || menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [selected, menuOpen]);

  const goTo = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
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
    if (/available|hire|opportunit/.test(q)) return "Umar is open to internships and collaborations. Use the contact form below to get in touch.";
    if (/contact|email|reach/.test(q)) return "Use the contact form on this page to send Umar a message.";
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
    <div className="site-intro" aria-hidden="true"><span>MU</span></div>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-nav"><div className="nav-inner">
      <a href="#home" className="brand" aria-label="Mohammad Umar, home"><span className="brand-mark">MU</span><span>Mohammad Umar</span></a>
      <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">{nav.map(([label, id]) => <a key={id} className={`nav-link ${active === id ? "is-active" : ""}`} href={`#${id}`}>{label}</a>)}</nav>
      <div className="flex items-center gap-2"><button className="icon-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? "☼" : "◐"}</button><button className="menu-toggle md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? "Close" : "Menu"}<span className="menu-lines" /></button></div>
    </div></header>
    <AnimatePresence>{menuOpen && <motion.nav className="mobile-menu md:hidden" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} aria-label="Mobile navigation">{nav.map(([label, id], i) => <a key={id} style={{ "--i": i }} href={`#${id}`} onClick={() => goTo(id)}>{label}<Arrow diagonal /></a>)}</motion.nav>}</AnimatePresence>
    <main id="main">
      <section id="home" className="hero wrap section-shell" aria-label="Introduction"><div className="hero-kicker"><span className="availability-dot" /><span><b>Mohammad Umar</b> &nbsp;/&nbsp; Computer Science Undergraduate · Software Developer</span><span className="hero-place">India &nbsp;/&nbsp; B.Tech CSE ’27</span><span className="hero-status">Open to internships and collaborations</span></div>
        <div className="hero-heading"><p className="eyebrow">Computer science · Software engineering</p><h1 aria-label="Engineering ideas into experiences."><span className="hero-line"><span>Engineering</span></span><span className="hero-line"><span>ideas into</span></span><span className="hero-line"><span className="hero-accent">experiences.</span></span></h1><div className="sculpture"><HeroSculpture /></div></div>
        <div className="hero-bottom"><div className="hero-intro"><p>I’m Mohammad Umar, a Computer Science undergraduate passionate about building thoughtful digital products, exploring emerging technologies, and solving meaningful problems through code.</p><div className="hero-actions"><a className="button button-primary" href="#projects">Explore my work <Arrow /></a><a className="button" href="#contact">Let’s connect</a><button className="button" onClick={() => setChatOpen(true)}><span className="spark-mark">✳</span>Ask Umar AI</button></div></div><aside className="hero-side"><dl><div><dt>Studying</dt><dd>B.Tech CSE, COER University</dd></div><div><dt>Batch</dt><dd>2023 – 2027</dd></div><div><dt>Focus</dt><dd>Frontend, full-stack, ML</dd></div></dl><div className="scroll-cue"><span className="scroll-line" />Scroll</div></aside></div>
      </section>

      <section id="about" className="section-shell wrap"><SectionTitle eyebrow="About">Curiosity drives what I build.</SectionTitle><div className="about-grid"><aside className="about-side"><p className="mono-label">Selected details</p><dl><div><dt>Degree</dt><dd>B.Tech, Computer Science and Engineering</dd></div><div><dt>University</dt><dd>COER University</dd></div><div><dt>Batch</dt><dd>2023 – 2027</dd></div><div><dt>CGPA</dt><dd>7.9 / 10</dd></div><div><dt>Interests</dt><dd>Frontend, full-stack, AI and ML, problem solving</dd></div></dl></aside><div className="about-main"><div className="statement"><p>I’m a Computer Science undergraduate who enjoys exploring how technology works and using that understanding to create useful products.</p><p>My interests span frontend engineering, full-stack development, artificial intelligence, and problem-solving.</p><p>I believe great software is more than functional code. It is about understanding people, identifying problems, and designing solutions that are intuitive, reliable, and meaningful.</p></div><div className="principles"><article><span>01</span><h3>Academic background</h3><p>Pursuing a B.Tech at COER University, with coursework in data structures, algorithms, OOP, DBMS, and computer networks.</p></article><article><span>02</span><h3>Currently learning</h3><p>Next.js and TypeScript, machine learning with scikit-learn, and DSA practice in C++.</p></article><article><span>03</span><h3>Technical interests</h3><p>Frontend engineering, full-stack development, AI and machine learning, and thoughtful digital products.</p></article></div></div></div></section>

      <section id="projects" className="section-shell work-section"><div className="wrap"><div className="projects-heading"><SectionTitle eyebrow="Selected projects">Four projects across web development, machine learning, and product design.</SectionTitle><p>Open any of them for the case study.</p></div><div className="projects-list">{projects.map((project, index) => <motion.article className="project-row" key={project.name} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.75, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}><button className={`project-art art-${index + 1}`} onClick={() => setSelected(index)} aria-label={`Open ${project.name} case study`}><ProjectArtwork index={index} title={project.name} /><span className="art-caption">PROJECT / {String(index + 1).padStart(2, "0")}</span><span className="art-arrow"><Arrow diagonal /></span></button><div className="project-info"><div className="project-meta"><span className="proj-num">{String(index + 1).padStart(2, "0")}</span><span>{project.kind}</span></div><button className="project-title" onClick={() => setSelected(index)}>{project.name}<Arrow diagonal /></button><p>{project.description}</p><ul className="tag-list">{project.stack.map((tag) => <li key={tag}>{tag}</li>)}</ul><button className="project-open" onClick={() => setSelected(index)}>View case study <Arrow /></button></div></motion.article>)}</div></div></section>

      <section id="experience" className="section-shell wrap"><SectionTitle eyebrow="Experience and education">Learning by building.</SectionTitle><div className="journey-grid"><div className="timeline"><motion.article initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .65 }}><time>May – Jul 2026</time><div><h3>C++ Programming Intern</h3><p className="timeline-org">InternPe</p><p className="body-copy">Internship focused on C++ programming and problem solving.</p></div></motion.article><motion.article initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .65, delay: .1 }}><time>Jun – Sep 2025</time><div><h3>Frontend Developer Intern</h3><p className="timeline-org">NovaNectar</p><p className="body-copy">Internship focused on frontend development with HTML, CSS, and JavaScript.</p></div></motion.article><motion.article initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .65, delay: .2 }}><time>Four weeks</time><div><h3>Python Programming Intern</h3><p className="timeline-org">InternPe</p><p className="body-copy">Four-week internship focused on Python programming.</p></div></motion.article></div><aside className="education-card"><Eyebrow>Education</Eyebrow><p className="edu-degree">B.Tech, Computer Science and Engineering</p><p className="edu-school">COER University<br />2023 — 2027</p><div className="edu-rule" /><p className="edu-cgpa">7.9 <small>/ 10 CGPA</small></p></aside></div></section>

      <section id="skills" className="section-shell wrap skills-section"><SectionTitle eyebrow="Technical expertise">The tools I think with.</SectionTitle><div className="skills-list">{groups.map(([label, ...skills], index) => <motion.div className="skill-row" key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .55, delay: index * .05 }}><h3>{label}</h3><ul>{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></motion.div>)}</div></section>

      <section id="achievements" className="section-shell wrap proof-section"><motion.div className="proof-big" initial={{ opacity: 0, scale: .92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .85 }}><span>150</span><span className="proof-plus">+</span><p>LeetCode problems<br />solved</p></motion.div><div className="proof-content"><Eyebrow>Achievements and learning</Eyebrow><h2 className="section-title">Practice, every day.</h2><div className="proof-list"><article><span>01</span><div><h3>DSA practice in C++</h3><p>Regular problem solving across core data structures and algorithms.</p></div></article><article><span>02</span><div><h3>Technical certifications</h3><p>Courses completed alongside university coursework.</p></div></article><article><span>03</span><div><h3>Hackathon participation</h3><p>Building and shipping ideas against the clock with other students.</p></div></article><article><span>04</span><div><h3>Continuous learning</h3><p>Always working through the next framework, concept, or problem set.</p></div></article></div></div></section>

      <section id="contact" className="contact-section"><div className="wrap"><Eyebrow>06 / Start a conversation</Eyebrow><h2 className="contact-title">Have an idea<br />worth building<span className="accent-dot">?</span></h2><div className="contact-grid"><div><p className="contact-lead">I’m interested in meaningful projects, thoughtful technical challenges, and opportunities to learn and collaborate.</p><a className="social-link" href="https://github.com/umar24nov" target="_blank" rel="noreferrer">Find me on GitHub <Arrow diagonal /></a></div><form className="contact-form" onSubmit={submitContact}><input className="contact-honey" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" /><label>Your name<input name="name" autoComplete="name" required maxLength="80" placeholder="What should I call you?" /></label><label>Email address<input type="email" name="email" autoComplete="email" required maxLength="160" placeholder="you@example.com" /></label><label>What’s on your mind?<select name="topic"><option>Project idea</option><option>Internship opportunity</option><option>Collaboration</option><option>Just saying hello</option></select></label><label>Message<textarea name="message" rows="4" required minLength="10" maxLength="4000" placeholder="A little context goes a long way…" /></label>{process.env.REACT_APP_TURNSTILE_SITE_KEY && <div className="cf-turnstile" data-sitekey={process.env.REACT_APP_TURNSTILE_SITE_KEY} data-theme="auto" />}<div className="form-bottom"><button className="button button-primary" type="submit" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Send a message"}<Arrow /></button><p role="status" className={`form-status ${formState}`}>{formState === "sent" ? notificationSent ? "Thanks — your message was saved and sent to my inbox." : "Thanks — your message was received." : formState === "error" ? formNotice : "I’ll follow up using your email address."}</p></div></form></div></div></section>
    </main>
    <footer className="site-footer wrap"><a className="brand" href="#home"><span className="brand-mark">MU</span><span>Mohammad Umar</span></a><p>Designed with care. Built to keep growing.</p><a className="back-top" href="#home">Back to top ↑</a><span className="footer-year">© {new Date().getFullYear()}</span></footer>
    <button className="assistant-launch" onClick={() => { setChatOpen(true); setChatMinimized(false); }} aria-label="Open Ask Umar AI"><span>✳</span> Ask Umar AI</button>
    <AnimatePresence>{chatOpen && <motion.div className={`assistant-panel ${chatMinimized ? "is-minimized" : ""}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} role="dialog" aria-modal="false" aria-labelledby="assistant-title"><div className="assistant-head"><div><p className="mono-label">Profile-based demo</p><h2 id="assistant-title">Umar AI</h2></div><div className="assistant-controls"><button className="icon-button" onClick={newChat} aria-label="Start a new chat">↻</button><button className="icon-button" onClick={() => setChatMinimized(!chatMinimized)} aria-label={chatMinimized ? "Expand assistant" : "Minimize assistant"}>{chatMinimized ? "+" : "−"}</button><button className="icon-button" onClick={() => setChatOpen(false)} aria-label="Close assistant">×</button></div></div>{!chatMinimized && <><div className="assistant-messages" aria-live="polite">{messages.map((message, index) => <p key={`${index}-${message.role}`} className={`assistant-message ${message.role}`}>{message.text}</p>)}</div><div className="assistant-prompts">{["What projects have you built?", "Tell me about your education", "What skills do you use?", "What is your experience?"].map((prompt) => <button key={prompt} onClick={() => submitQuestion(prompt)}>{prompt}</button>)}</div><form className="assistant-form" onSubmit={askUmar}><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about Umar…" maxLength={240} aria-label="Ask about Umar" /><button aria-label="Send question"><Arrow /></button></form><p className="assistant-note">Demo mode · Answers are based on the portfolio profile.</p></>}</motion.div>}</AnimatePresence>
    <AnimatePresence>{selected !== null && <motion.div className="case-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}><motion.article className="case-panel" initial={{ y: 42, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 28, opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="case-title"><div className="case-top"><span className="mono-label">Case study · {String(selected + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close case study">×</button></div><div className={`case-visual art-${selected + 1}`}><span className="art-word">{projects[selected].name.split(" ")[0]}</span></div><Eyebrow>{projects[selected].kind}</Eyebrow><h2 id="case-title" className="case-title">{projects[selected].name}</h2><div className="case-copy"><div><h3>Overview</h3><p>{projects[selected].details}</p></div><div><h3>Highlights</h3><ul>{projects[selected].features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><div><h3>Built with</h3><ul className="tag-list">{projects[selected].stack.map((tag) => <li key={tag}>{tag}</li>)}</ul></div></div><div className="case-links"><a className="text-link" href={projects[selected].github} target="_blank" rel="noreferrer">GitHub profile <Arrow diagonal /></a>{projects[selected].href.startsWith("http") && <a className="text-link" href={projects[selected].href} target="_blank" rel="noreferrer">Visit project <Arrow diagonal /></a>}</div><button className="case-next" onClick={() => setSelected((selected + 1) % projects.length)}>Next project <Arrow /></button></motion.article></motion.div>}</AnimatePresence>
  </div></MotionConfig>;
}
