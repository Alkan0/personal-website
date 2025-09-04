// src/app/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

type SectionId = "home" | "about" | "projects" | "contact";

// Hydration-safe year (same on server & client)
const COPYRIGHT_YEAR = 2025;

export default function Home() {
  // ===== Accent color state (SSR-safe first render)
  const [hue, setHue] = useState<number>(220); // deterministic default

  // After mount: load saved hue (if any)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("accent-hue");
      if (saved) setHue(parseInt(saved, 10));
    } catch {}
  }, []);

  // Apply hue to CSS var + persist
  useEffect(() => {
    const brand = `hsl(${hue} 85% 72%)`;
    document.documentElement.style.setProperty("--brand", brand);
    try {
      localStorage.setItem("accent-hue", String(hue));
    } catch {}
  }, [hue]);

  // ===== Header elevation on scroll
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

  // ===== Reveal-on-scroll
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

  // ===== Active nav highlighting
  const sections: SectionId[] = useMemo(() => ["home", "about", "projects", "contact"], []);
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

  return (
    <>
      <header ref={headerRef as any} className={styles.header} aria-label="Site header">
        <a className={styles.brand} href="#home" aria-label="Go to top">
          Alkinoos Michalopoulos
        </a>
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
      </header>

      <main id="home" className={styles.main}>
        {/* Hero */}
        <section id="home" className={`${styles.hero} reveal`} aria-labelledby="hero-title">
          <div className={styles.heroInner}>
            <img
              src="https://scontent-fra3-1.xx.fbcdn.net/v/t39.30808-6/542207886_818769453819604_7657809342489893473_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=POIfizpTJVQQ7kNvwGM0GGj&_nc_oc=AdmQ5DnQ_1luLB3AhjW2_NX0Anzh_7WTUHuhMiN26uivHBVAu0b8QGTmyzoPRFTfOiE&_nc_zt=23&_nc_ht=scontent-fra3-1.xx&_nc_gid=KRH4OVBYSaggO8BjsJ4aJw&oh=00_AfY2lVKAjd0rHopxrGMQ6MQD9tkfZ3AIC9gCjhHlsFaogw&oe=68BFAC12"
              alt="Your portrait"
              className={styles.avatar}
            />
            <h1 id="hero-title">Hi, I’m Alkan 🧑🏼‍💻</h1>
            <p className={styles.tagline}>
              I’m a Full Stack and Cloud Engineer working on enterprise-grade financial applications at Piraeus Bank. I focus on building scalable systems, designing secure cloud infrastructure, and delivering software from start to finish.
            </p>
            <div className={styles.ctaRow}>
              <a className={styles.primaryBtn} href="#projects">View Projects</a>
              <a className={styles.secondaryBtn} href="#contact">Contact Me</a>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className={`${styles.section} reveal`} aria-labelledby="about-title">
          <h2 id="about-title">About</h2>
          <p>
            Write 2–3 short paragraphs about your background, specialties, and the kinds of
            problems you love solving. Keep it friendly and skimmable.
          </p>
          <ul className={styles.bullets}>
            <li>🌟 Focus: Frontend, Backend, Data, AI</li>
            <li>🛠️ Tools: React, TypeScript, Node, Python</li>
            <li>📍 Location: City, Country</li>
          </ul>
        </section>

        {/* Projects */}
        <section id="projects" className={`${styles.section} reveal`} aria-labelledby="projects-title">
          <h2 id="projects-title">Projects</h2>
          <div className={styles.grid}>
            <article className={`${styles.card} reveal`}>
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                alt="Project One"
                className={styles.cardImg}
                loading="lazy"
              />
              <div className={styles.cardBody}>
                <h3>Project One</h3>
                <p>
                  One-liner that explains the problem, your solution, impact, and what tech you used.
                </p>
                <div className={styles.tags}>
                  <span>React</span><span>Node</span><span>PostgreSQL</span>
                </div>
                <div className={styles.links}>
                  <a href="https://example.com" target="_blank" rel="noreferrer">Live →</a>
                  <a href="https://github.com/your/repo" target="_blank" rel="noreferrer">Code →</a>
                </div>
              </div>
            </article>

            <article className={`${styles.card} reveal`}>
              <img
                src="https://images.unsplash.com/photo-1526481280698-8fcc13fd2401?q=80&w=800&auto=format&fit=crop"
                alt="Project Two"
                className={styles.cardImg}
                loading="lazy"
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
              <img
                src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop"
                alt="Project Three"
                className={styles.cardImg}
                loading="lazy"
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
        </section>

        {/* Contact */}
        <section id="contact" className={`${styles.section} reveal`} aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>
          <div className={styles.contactWrap}>
            <div>
              <p>
                The quickest way to reach me is email. I’m open to interesting projects,
                collaborations, and coffee chats.
              </p>
              <p className={styles.contactLine}>
                ✉️ <a href="mailto:you@example.com">you@example.com</a>
              </p>
              <p className={styles.contactLine}>
                🐙 <a href="https://github.com/your">GitHub</a> &nbsp;|&nbsp; 💼{" "}
                <a href="https://www.linkedin.com/in/your">LinkedIn</a>
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
        </section>
      </main>

      {/* Tiny floating style panel */}
      <aside className={`${styles.stylePanel} reveal`} aria-label="Style controls">
        <h4>Style</h4>
        <div className={styles.row}>
          <input
            className={styles.range}
            type="range"
            min={0}
            max={359}
            value={hue}
            onChange={(e) => setHue(parseInt(e.target.value, 10))}
            aria-label="Accent hue"
          />
          <span className={styles.small}>{hue}</span>
        </div>
        <div className={styles.small}>
          Drag the slider to change the accent color live.
        </div>
      </aside>

      <footer className={`${styles.footer} reveal`}>
        © {COPYRIGHT_YEAR} Your Name — Built with Next.js
      </footer>
    </>
  );
}
