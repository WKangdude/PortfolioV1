import { profile } from '@/data/profile';
import styles from './Sections.module.css';

export function Contact() {
  const available = profile.email || profile.github || profile.linkedin;
  return (
    <section
      id="contacto"
      className={styles.contact}
      aria-labelledby="contact-heading"
    >
      <div>
        <p className={styles.sectionIntro}>
          Las buenas ideas empiezan conversando
        </p>
        <h2 id="contact-heading">
          ¿Construimos algo
          <br />
          interesante?
        </h2>
        <p>
          Una idea, un proyecto o una nueva perspectiva.
          <br />
          Siempre hay algo por explorar.
        </p>
      </div>
      <div className={styles.contactActions}>
        {profile.email ? (
          <a href={`mailto:${profile.email}`} className={styles.primary}>
            Hablemos por correo <span aria-hidden="true">↗</span>
          </a>
        ) : null}
        {profile.github ? (
          <a href={profile.github} className={styles.textLink}>
            GitHub ↗
          </a>
        ) : null}
        {profile.linkedin ? (
          <a href={profile.linkedin} className={styles.textLink}>
            LinkedIn ↗
          </a>
        ) : null}
        {!available ? (
          <div className={styles.contactPending}>
            <span className={styles.contactSymbol} aria-hidden="true">
              ↗
            </span>
            <p>Próximamente, una línea directa.</p>
            <span>Correo y perfiles profesionales por incorporar.</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
