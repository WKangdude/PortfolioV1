import { Sidebar } from '@/components/layout/Sidebar';
import { Hero } from '@/components/sections/Hero';
import { Specialties } from '@/components/sections/Specialties';
import { Projects } from '@/components/sections/Projects';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { profile } from '@/data/profile';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Sidebar />
      <main id="contenido" className={styles.main}>
        <Hero />
        <Specialties />
        <Projects />
        <About />
        <Contact />
        <footer className={styles.footer}>
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>Hecho con curiosidad y código.</span>
          <a href="#inicio">Volver al inicio ↑</a>
        </footer>
      </main>
    </>
  );
}
