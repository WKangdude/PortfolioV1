import { projects } from '@/data/projects';
import { Icon } from '@/components/ui/Icon';
import styles from './Sections.module.css';
import { FoodlifyPreview } from './FoodlifyPreview';

export function Projects() {
  return (
    <section
      id="proyectos"
      className={styles.section}
      aria-labelledby="projects-heading"
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.sectionIntro}>De la idea a la interfaz</p>
          <h2 id="projects-heading">Proyectos con propósito.</h2>
        </div>
        <span className={styles.sectionAside}>
          Una mirada a lo que construyo.
        </span>
      </div>
      {projects.map((project) => (
        <article key={project.id} className={styles.project}>
          <div className={styles.projectPreview}>
            <FoodlifyPreview />
            <span className={styles.previewCaption}>
              Representación conceptual de la interfaz
            </span>
          </div>
          <div className={styles.projectCopy}>
            <span className={styles.projectCategory}>
              <Icon name="layout" />
              {project.category}
            </span>
            <h3>
              {project.title}
              <span>.</span>
            </h3>
            <p>{project.description}</p>
            <div className={styles.projectFeatures}>
              {project.features.map((feature) => (
                <span key={feature}>{feature}</span>
              ))}
            </div>
            <details className={styles.projectDetails}>
              <summary>
                Conocer el proyecto <span aria-hidden="true">+</span>
              </summary>
              <div>
                <h4>Del menú a la cocina</h4>
                <p>
                  Foodlify reúne el menú y la gestión del restaurante. Al enviar
                  una comanda, la cocina la recibe en tiempo real para coordinar
                  su preparación.
                </p>
                <h4>Información por completar</h4>
                <p>
                  La contribución técnica, las tecnologías, los resultados y las
                  capturas reales se añadirán cuando estén disponibles.
                </p>
                {project.url ? (
                  <a href={project.url}>Visitar Foodlify ↗</a>
                ) : null}
                {project.repository ? (
                  <a href={project.repository}>Ver repositorio ↗</a>
                ) : null}
              </div>
            </details>
          </div>
        </article>
      ))}
    </section>
  );
}
