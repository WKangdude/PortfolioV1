import { profile } from '@/data/profile';
import { HeroCanvas } from '@/components/three/HeroCanvas';
import { Icon } from '@/components/ui/Icon';
import styles from './Sections.module.css';

export function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.topline}>
        <span>Datos. Código. Nuevas dimensiones.</span>
        <span className={styles.topStatus}>
          <i /> Abierto a nuevas ideas
        </span>
      </div>
      <div className={styles.heroGrid}>
        <div className={styles.heroText}>
          <p className={styles.greeting}>Hola, soy</p>
          <h1 id="hero-heading">{profile.name}</h1>
          <p className={styles.role}>{profile.role}</p>
          <div className={styles.shortRule} />
          <p className={styles.introduction}>{profile.introduction}</p>
          <div className={styles.tags}>
            <a href="#sobre-mi">Data Science</a>
            <a href="#proyectos">Web Development</a>
            <a href="#especialidades">WebGL / Three.js</a>
          </div>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="#proyectos">
              Explorar proyectos <span aria-hidden="true">↗</span>
            </a>
            <a className={styles.textLink} href="#contacto">
              Hablemos <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <HeroCanvas />
      </div>
      <div className={styles.heroBottom}>
        <a href="#especialidades">
          <Icon name="down" />
          Un poco de lo que hago
        </a>
        <span>La tecnología también puede sentirse humana.</span>
      </div>
    </section>
  );
}
