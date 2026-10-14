import { profile, specialties } from '@/data/profile';
import styles from './Sections.module.css';

export function About() {
  return (
    <section
      id="sobre-mi"
      className={`${styles.section} ${styles.about}`}
      aria-labelledby="about-heading"
    >
      <div className={styles.aboutCopy}>
        <p className={styles.sectionIntro}>La persona detrás del código</p>
        <h2 id="about-heading">
          Curiosidad como
          <br />
          punto de partida.
        </h2>
        <p>{profile.introduction}</p>
        <p>
          Este portafolio conecta mis áreas de interés: entender la información,
          construir aplicaciones y explorar nuevas formas de interacción.
        </p>
        {profile.cv ? (
          <a className={styles.primary} href={profile.cv} download>
            Descargar CV ↓
          </a>
        ) : null}
        <span className={styles.contentNote}>
          Trayectoria y biografía ampliada por incorporar.
        </span>
      </div>
      <div className={styles.skillGroups}>
        {specialties.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <div>
              {item.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
        <p className={styles.contentNote}>
          Áreas de interés y tecnologías del portafolio; experiencia por
          confirmar.
        </p>
      </div>
    </section>
  );
}
