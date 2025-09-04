// src/app/page.tsx
"use client";

import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <a className={styles.brand} href="#home">Alkinoos Michalopoulos</a>
        <nav className={styles.nav}>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="home" className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <img
              src="https://avatars.githubusercontent.com/u/61196191?v=4"
              alt="Your portrait"
              className={styles.avatar}
            />
            <h1>Hi, I’m Alkinoos :)</h1>
            <p className={styles.tagline}>
              Your role — short line about what you do and what you’re looking for.
            </p>
            <div className={styles.ctaRow}>
              <a className={styles.primaryBtn} href="#projects">View Projects</a>
              <a className={styles.secondaryBtn} href="#contact">Contact Me</a>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className={styles.section}>
          <h2>About</h2>
          <p>
            Write 2–3 short paragraphs about your background, specialties, and the kinds of
            problems you love solving. Keep it friendly and skimmable.
          </p>
          <ul className={styles.bullets}>
            <li>🌟 Focus: FullStack, Cloud Engineering and whatever you want :)</li>
            <li>🛠️ Tools: Csharp, Python, Docker, Azure [DevOps, APIM, AI Foundry] and a lot of staff and frameworks</li>
            <li>📍 Location: Athens, Greece</li>
          </ul>
        </section>

        {/* Projects */}
        <section id="projects" className={styles.section}>
          <h2>Projects</h2>
          <div className={styles.grid}>
            <article className={styles.card}>
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

            <article className={styles.card}>
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

            <article className={styles.card}>
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
        <section id="contact" className={styles.section}>
          <h2>Contact</h2>
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

      <footer className={styles.footer}>
        © {new Date().getFullYear()} Your Name — Built with Next.js
      </footer>
    </>
  );
}
