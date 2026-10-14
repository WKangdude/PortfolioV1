import { specialties } from '@/data/profile';
import { Icon } from '@/components/ui/Icon';
import styles from './Sections.module.css';

export function Specialties() {
  return (
    <section
      id="especialidades"
      className={styles.specialties}
      aria-label="Mis áreas de enfoque"
    >
      {specialties.map((item) => (
        <a href={item.href} key={item.id} className={styles.specialty}>
          <div className={styles.specialtyTop}>
            <div className={styles.iconBadge}>
              <Icon name={item.icon} />
            </div>
            <span className={styles.cornerArrow} aria-hidden="true">
              ↗
            </span>
          </div>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <span className={styles.specialtyFoot}>
            {item.id === 'datos'
              ? 'Encontrar el significado'
              : item.id === 'web'
                ? 'Construir con propósito'
                : 'Explorar lo posible'}
          </span>
        </a>
      ))}
    </section>
  );
}
