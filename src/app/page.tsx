// src/app/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

const NAV_SECTIONS = ["home", "about", "experience", "projects", "contact"] as const;
type SectionId = typeof NAV_SECTIONS[number];

const COPYRIGHT_YEAR = 2025;

export default function Home() {
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  // Accent color (SSR-safe)
  const [hue, setHue] = useState<number>(220);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("accent-hue");
      if (saved) setHue(parseInt(saved, 10));
    } catch { }
  }, []);

  useEffect(() => {
    const brand = `hsl(${hue} 85% 72%)`;
    document.documentElement.style.setProperty("--brand", brand);
    try { localStorage.setItem("accent-hue", String(hue)); } catch { }
  }, [hue]);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;

    const onDocDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        mobileNavRef.current?.contains(t) ||
        menuBtnRef.current?.contains(t)
      ) return; // click inside, ignore
      setMenuOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);
  // Header elevation on scroll
  const headerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = headerRef.current;
      if (!h) return;
      if (window.scrollY > 6) h.classList.add(styles.elevate);
      else h.classList.remove(styles.elevate);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const close = () => setMenuOpen(false);
    const onResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener("hashchange", close);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("hashchange", close);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  // Reveal-on-scroll
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Active nav highlighting
  const sections: readonly SectionId[] = NAV_SECTIONS; // use the value so it's not “type-only”

  const [active, setActive] = useState<SectionId>("home");
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(id);
          });
        },
        { threshold: 0.5 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);
  useEffect(() => {
    let raf = 0;
    const root = document.documentElement;

    const update = (xPct: number, yPct: number) => {
      root.style.setProperty("--aura-x", (xPct * 2 - 1).toFixed(3)); // -1..1
      root.style.setProperty("--aura-y", (yPct * 2 - 1).toFixed(3)); // -1..1
    };

    const onMove = (e: PointerEvent) => {
      if (!window.innerWidth || !window.innerHeight) return;
      const xPct = e.clientX / window.innerWidth;
      const yPct = e.clientY / window.innerHeight;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => update(xPct, yPct));
    };

    const onScroll = () => {
      // small vertical influence from scroll position
      const yPct = Math.min(1, Math.max(0, window.scrollY / (document.body.scrollHeight - window.innerHeight || 1)));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // keep x as center (0.5), nudge y based on scroll
        update(0.5, yPct);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Slow continuous rotation (very subtle)
  useEffect(() => {
    let raf = 0;
    const root = document.documentElement;
    const start = performance.now();

    const tick = (t: number) => {
      const elapsed = (t - start) / 1000;        // seconds
      const deg = (elapsed * 4) % 360;           // 4°/s
      root.style.setProperty("--aura-rot", `${deg}deg`);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <>
      <div className={styles.aura} aria-hidden="true" />
      <header ref={headerRef} className={styles.header} aria-label="Site header">


        <a className={styles.brand} href="#home" aria-label="Go to top">
          Alkinoos Michalopoulos
        </a>

        {/* Desktop / tablet nav */}
        <nav className={styles.nav} aria-label="Primary">
          {sections.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "active" : undefined}
              aria-current={active === id ? "page" : undefined}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>

        {/* Hamburger button (visible on mobile) */}
        <button
          className={styles.menuBtn}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <>
            <div
              className={styles.scrim}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <div id="mobile-nav" className={styles.mobileNav} role="dialog" aria-label="Mobile navigation">
              {sections.map((id) => (
                <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              ))}
            </div>
          </>
        )}
      </header>


      <main id="home" className={styles.main}>
        {/* Hero */}
        <section id="home" className={`${styles.hero} reveal`} aria-labelledby="hero-title">
          <div className={styles.heroInner}>
            <Image
              src="/avatar.jpg"
              alt="Alkan portrait"
              width={220}
              height={220}
              className={styles.avatar}
              priority
            />
            <h1 id="hero-title">Hi, I’m Alkan 🧑🏼‍💻</h1>
            <p className={styles.tagline}>
              Welcome to my world 🚀 <br /> I love turning ideas into code,
              exploring new technologies, and building things that make an impact.
            </p>
            <div className={styles.ctaRow}>
              <a className={styles.primaryBtn} href="#projects">View Projects</a>
              <a className={styles.secondaryBtn} href="#contact">Contact Me</a>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className={`${styles.section} reveal`} aria-labelledby="about-title">
          <div className={styles.sectionCard}>
            <h2 id="about-title">About</h2>
            <p>
              I’m a <strong>Full Stack & Cloud Engineer</strong> currently working on a project at
              <strong> Piraeus Bank</strong>, where I’m responsible for the <strong>APIs</strong> and
              <strong> cloud infrastructure</strong> powering services for businesses.<br />
              My focus is on building scalable, secure systems and ensuring that complex
              financial applications run reliably in production. I enjoy end-to-end ownership
              from design and implementation to deployment and observability.
            </p>

            <div className={styles.techGrid} aria-label="Technical toolbox">
              {/* Languages */}
              <article className={styles.techCard}>
                <div className={styles.techIcon} aria-hidden="true">&lt;/&gt;</div>
                <div>
                  <h3 className={styles.techTitle}>Languages</h3>
                  <div className={styles.chips}>
                    <span>C#</span><span>TypeScript</span><span>JavaScript</span><span>Python</span><span>C/C++</span><span>Java</span>
                  </div>
                </div>
              </article>
              {/* Web Protocols */}
              <article className={styles.techCard}>
                <div className={styles.techIcon} aria-hidden="true">🌐</div>
                <div>
                  <h3 className={styles.techTitle}>Web Protocols</h3>
                  <div className={styles.chips}>
                    <span>REST</span><span>WebSockets</span><span>MQTT</span><span>GraphQL</span><span>SOAP</span>
                  </div>
                </div>
              </article>
              {/* Frontend */}
              <article className={styles.techCard}>
                <div className={styles.techIcon} aria-hidden="true">UI</div>
                <div>
                  <h3 className={styles.techTitle}>Frontend</h3>
                  <div className={styles.chips}>
                    <span>Blazor</span><span>Angular</span><span>React</span><span>Next.js</span><span>CSS Modules</span><span>HTML</span>
                  </div>
                </div>
              </article>

              {/* Backend / APIs */}
              <article className={styles.techCard}>
                <div className={styles.techIcon} aria-hidden="true">API</div>
                <div>
                  <h3 className={styles.techTitle}>Backend & APIs</h3>
                  <div className={styles.chips}>
                    <span>.NET</span><span>Node.js</span><span>ASP.NET Web API</span><span>FastAPI</span><span>Spring Boot</span>
                  </div>
                </div>
              </article>

              {/* Databases */}
              <article className={styles.techCard}>
                <div className={styles.techIcon} aria-hidden="true">⛁</div>
                <div>
                  <h3 className={styles.techTitle}>Databases & ORM</h3>
                  <div className={styles.chips}>
                    <span>SQL Server</span><span>PostgreSQL</span><span>SMSS</span><span>Entity framework</span><span>SQL Alchemy</span>
                  </div>
                </div>
              </article>

              {/* Cloud / DevOps */}
              <article className={styles.techCard}>
                <div className={styles.techIcon} aria-hidden="true">☁︎</div>
                <div>
                  <h3 className={styles.techTitle}>Cloud & DevOps</h3>
                  <div className={styles.chips}>
                    <span>Azure</span><span>Kuburnetes</span><span>Docker</span><span>Containerization</span><span>ArgoCD</span><span>Infra-as-Code</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
        {/* Experience */}
        <section id="experience" className={`${styles.section} reveal`} aria-labelledby="experience-title">
          <div className={styles.sectionCard}>
            <h2 id="experience-title">Experience</h2>
            <div className={styles.timeline}>
              <div className={styles.entry}>
                <div className={styles.dot} />
                <div className={styles.entryContent}>
                  <h3>Information Technology Consultant</h3>
                  <p>EY — Apr 2025 – Present</p>
                </div>
              </div>
              <div className={styles.entry}>
                <div className={styles.dot} />
                <div className={styles.entryContent}>
                  <h3>Junior Web Developer</h3>
                  <p>COVARIANCE P.C. — Sep 2024 – Apr 2025</p>
                </div>
              </div>
              <div className={styles.entry}>
                <div className={styles.dot} />
                <div className={styles.entryContent}>
                  <h3>Web Development Intern</h3>
                  <p>COVARIANCE P.C. — Jul 2024 – Sep 2024</p>
                </div>
              </div>
              <div className={styles.entry}>
                <div className={styles.dot} />
                <div className={styles.entryContent}>
                  <h3>Robotics Laboratory Manager</h3>
                  <p>University of the Aegean — Feb 2024 – Jul 2024</p>
                </div>
              </div>
            </div>
            {/* CV Download under the line */}
            <div className={styles.cvDownload}>
              <a href="/cv.pdf" download className={styles.secondaryBtn}>
                Download CV
              </a>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className={`${styles.section} reveal`} aria-labelledby="projects-title">
          <div className={styles.sectionCard}>
            <h2 id="projects-title">Projects</h2>
            <div className={styles.grid}>
              <article className={`${styles.card} reveal`}>
                <Image
                  src="/thesis.png"
                  alt="Project One"
                  width={800}
                  height={450}
                  className={styles.cardImg}
                />
                <div className={styles.cardBody}>
                  <h3>Hand anti-spasticity robotic device</h3>
                  <p>
                    My thesis project for graduation
                  </p>
                  <div className={styles.tags}>
                    <span>RaspberryPi</span><span>Python</span><span>Robotics modules</span>
                  </div>
                  <div className={styles.links}>
                    <a href="https://github.com/Alkan0/Anti-Spasticity_Hand-Device" target="_blank" rel="noreferrer">Code →</a>
                  </div>
                </div>
              </article>

              <article className={`${styles.card} reveal`}>
                <Image
                  src="https://images.unsplash.com/photo-1526481280698-8fcc13fd2401?q=80&w=800&auto=format&fit=crop"
                  alt="Project Two"
                  width={800}
                  height={450}
                  className={styles.cardImg}
                />
                <div className={styles.cardBody}>
                  <h3>Project Two</h3>
                  <p>Highlight a result (e.g., 40% faster, 10k MAU) and your specific contribution.</p>
                  <div className={styles.tags}>
                    <span>Next.js</span><span>TypeScript</span><span>CSS</span>
                  </div>
                  <div className={styles.links}>
                    <a href="https://example.com" target="_blank" rel="noreferrer">Live →</a>
                    <a href="https://github.com/your/repo" target="_blank" rel="noreferrer">Code →</a>
                  </div>
                </div>
              </article>

              <article className={`${styles.card} reveal`}>
                <Image
                  src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop"
                  alt="Project Three"
                  width={800}
                  height={450}
                  className={styles.cardImg}
                />
                <div className={styles.cardBody}>
                  <h3>Project Three</h3>
                  <p>Keep it crisp. Add a small metric if you can; people skim.</p>
                  <div className={styles.tags}>
                    <span>Python</span><span>FastAPI</span><span>Redis</span>
                  </div>
                  <div className={styles.links}>
                    <a href="https://example.com" target="_blank" rel="noreferrer">Live →</a>
                    <a href="https://github.com/your/repo" target="_blank" rel="noreferrer">Code →</a>
                  </div>
                </div>
              </article>
            </div>
          </div>

        </section>

        {/* Contact */}
        <section id="contact" className={`${styles.section} reveal`} aria-labelledby="contact-title">
          <div className={styles.sectionCard}>
            <h2 id="contact-title">Contact</h2>
            <div className={styles.contactWrap}>
              <div>
                <p>
                  The quickest way to reach me is email. I’m open to interesting projects,
                  collaborations, and coffee chats.
                </p>
                <p className={styles.contactLine}>
                  ✉️ <a href="mailto:alkinoos.m@outlook.com">alkinoos.m@outlook.com</a>
                </p>
                <p className={styles.contactLine}>
                  <a href="https://github.com/alkan0" target="_blank" rel="noreferrer" aria-label="GitHub">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="white"
                      style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}
                    >
                      <path d="M12 .296a12 12 0 0 0-3.792 23.404c.6.112.82-.26.82-.577v-2.234c-3.338.727-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.746.083-.73.083-.73 1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.47-2.38 1.237-3.22-.124-.304-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 6 0c2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.872.12 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.804 5.624-5.475 5.92.43.372.823 1.102.823 2.222v3.293c0 .32.218.694.825.576A12 12 0 0 0 12 .296z" />
                    </svg>
                    GitHub
                  </a>
                  &nbsp;|&nbsp;
                  <a href="https://www.linkedin.com/in/alkinoos-michail-michalopoulos-tsesmetzis-4412a6262/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                      alt="LinkedIn logo"
                      width="20"
                      height="20"
                      style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}
                    />
                    LinkedIn
                  </a>
                </p>
              </div>
              <form
                className={styles.form}
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Demo form — wire this up to Formspree or an API route.");
                }}
              >
                <label>
                  <span>Your name</span>
                  <input placeholder="Ada Lovelace" required />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" placeholder="ada@example.com" required />
                </label>
                <label>
                  <span>Message</span>
                  <textarea rows={4} placeholder="Tell me about your idea…" required />
                </label>
                <button type="submit">Send →</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Tiny floating style panel */}
      {/* Style controls */}
      <aside className={styles.stylePanel} aria-label="Style controls">
        <input
          className={styles.range}
          type="range"
          min={0}
          max={359}
          value={hue}
          onChange={(e) => setHue(parseInt(e.target.value, 10))}
          aria-label="Accent hue"
        />
        <span
          className={styles.swatch}
          style={{ backgroundColor: `hsl(${hue} 85% 72%)` }}
          title={`Hue: ${hue}`}
        />
      </aside>

      <footer className={`${styles.footer} reveal`}>
        © {COPYRIGHT_YEAR} Alkinoos Michalopoulos
      </footer>
    </>
  );
}
