// src/app/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

type SectionId = "home" | "about" | "experience" | "projects" | "contact";

const COPYRIGHT_YEAR = 2025;

export default function Home() {
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
const sections: SectionId[] = useMemo(
  () => ["home", "about", "experience", "projects", "contact"],
  []
);
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
      <header ref={headerRef} className={styles.header} aria-label="Site header">
        <a className={styles.brand} href="#home" aria-label="Go to top">
          Alkinoos Michalopoulos
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {["home", "about", "experience", "projects", "contact"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === (id as any) ? "active" : undefined}
              aria-current={active === (id as any) ? "page" : undefined}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>
      </header>
      <div className={styles.aura} aria-hidden="true" />


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
            I’m a <strong>Full Stack & Cloud Engineer</strong> at <strong>Piraeus Bank</strong>, focused on building
            mission-critical financial systems with a keen eye on scalability, reliability, and security.
            I thrive on crafting robust back-end services, architecting secure cloud infrastructure, and
            delivering polished features from idea to production.
          </p>

          <p>
            What drives me:
          </p>
          <ul className={styles.bullets}>
            <li>✨ Engineering elegance — clean code, modular design, and clear interfaces</li>
            <li>⚡ Infrastructure resilience — designing systems that scale and stay reliable</li>
            <li>🔒 Security-first thinking — protecting sensitive data and reducing risk</li>
            <li>🚀 End-to-end ownership — taking features from spec to user delight</li>
          </ul>

          <p>
            Technologies I work with include cloud platforms (AWS / Azure), <strong>C#</strong>, Node.js, Python, React,
            SQL/NoSQL databases, CI/CD pipelines, containerization, and infrastructure-as-code.
          </p>

          <p>
            Let’s connect, build something powerful, and make systems that users — and businesses — can trust!
          </p>
        </section>

        {/* Experience */}
        <section id="experience" className={`${styles.section} reveal`} aria-labelledby="experience-title">
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
        </section>
        {/* Projects */}
        <section id="projects" className={`${styles.section} reveal`} aria-labelledby="projects-title">
          <h2 id="projects-title">Projects</h2>
          <div className={styles.grid}>
            <article className={`${styles.card} reveal`}>
              <Image
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                alt="Project One"
                width={800}
                height={450}
                className={styles.cardImg}
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
                ✉️ <a href="mailto:alkinoos.m@outlook.com">alkinoos.m@outlook.com</a>
              </p>
              <p className={styles.contactLine}>
                🐙 <a href="https://github.com/Alkan0">GitHub</a> &nbsp;|&nbsp; 💼{" "}
                <a href="https://www.linkedin.com/in/alkinoos-michail-michalopoulos-tsesmetzis-4412a6262/">LinkedIn</a>
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
