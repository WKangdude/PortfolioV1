import { createShape, particleSeed } from './particleModel';
import styles from './Scene.module.css';

const sphere = createShape('organic', 0, 520);
const dots = Array.from({ length: 520 }, (_, i) => ({
  x: (150 + sphere[i * 3] * 58).toFixed(3),
  y: (150 - sphere[i * 3 + 1] * 58).toFixed(3),
  radius: (0.75 + particleSeed(i, 3) * 0.8).toFixed(3),
  opacity: (0.35 + (sphere[i * 3 + 2] + 2) / 6).toFixed(3),
  shade: Math.floor(particleSeed(i, 3) * 5),
}));

export function SceneFallback() {
  return (
    <div
      className={styles.fallback}
      role="img"
      aria-label="Esfera de partículas, representación estática de datos y geometría"
    >
      <svg viewBox="0 0 300 300" aria-hidden="true">
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dot.radius}
            opacity={dot.opacity}
            className={styles[`shade${dot.shade}`]}
          />
        ))}
      </svg>
    </div>
  );
}
