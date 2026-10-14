'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { profile } from '@/data/profile';
import styles from './Sidebar.module.css';

const links = [
  { id: 'inicio', label: 'Inicio', icon: 'home' },
  { id: 'proyectos', label: 'Proyectos', icon: 'folder' },
  { id: 'sobre-mi', label: 'Sobre mí', icon: 'user' },
  { id: 'contacto', label: 'Contacto', icon: 'mail' },
];
const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function Sidebar() {
  const [active, setActive] = useState('inicio');
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const ready = useSyncExternalStore(
    subscribeToHydration,
    clientSnapshot,
    serverSnapshot,
  );
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -55% 0px' },
    );
    links.forEach((link) => {
      const section = document.getElementById(link.id);
      if (section) observer.observe(section);
    });
    const syncTheme = () =>
      setTheme(document.documentElement.dataset.theme ?? 'light');
    syncTheme();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem('portfolio-theme-v1', next);
    } catch {
      /* almacenamiento opcional */
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandRow}>
        <a
          className={styles.brand}
          href="#inicio"
          aria-label={`${profile.name}, inicio`}
          onClick={() => setOpen(false)}
        >
          <Logo className={styles.brandMark} />
        </a>
        <button
          disabled={!ready}
          className={styles.mobileToggle}
          aria-label={open ? 'Cerrar navegación' : 'Abrir navegación'}
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
      <div className={`${styles.contents} ${open ? styles.open : ''}`}>
        <div className={styles.portfolioLabel}>Portafolio personal</div>
        <nav
          id="navigation"
          aria-label="Navegación principal"
          className={styles.nav}
        >
          {links.map((link) => (
            <a
              key={link.id}
              className={`${styles.navLink} ${active === link.id ? styles.active : ''}`}
              href={`#${link.id}`}
              aria-current={active === link.id ? 'location' : undefined}
              onClick={() => {
                setActive(link.id);
                setOpen(false);
              }}
            >
              <Icon name={link.icon} />
              <span>{link.label}</span>
              {active === link.id ? (
                <span className={styles.activeDot} />
              ) : null}
            </a>
          ))}
        </nav>
        <div className={styles.bottom}>
          <div className={styles.smallNote}>
            Ideas que se convierten
            <br />
            en experiencias.
          </div>
          <div className={styles.socials}>
            {profile.github ? (
              <a href={profile.github} aria-label="GitHub de Andree">
                <Icon name="github" />
              </a>
            ) : null}
            {profile.linkedin ? (
              <a href={profile.linkedin} aria-label="LinkedIn de Andree">
                <Icon name="linkedin" />
              </a>
            ) : null}
            <a href="#contacto" aria-label="Ir a contacto">
              <Icon name="mail" />
            </a>
          </div>
          <div className={styles.status}>
            <span />
            Disponible para proyectos
          </div>
          <button
            type="button"
            disabled={!ready}
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={`Activar modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
            aria-pressed={theme === 'dark'}
          >
            <span aria-hidden="true" data-active={theme === 'light'}>
              ☼
            </span>
            <span aria-hidden="true" data-active={theme === 'dark'}>
              ☾
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
