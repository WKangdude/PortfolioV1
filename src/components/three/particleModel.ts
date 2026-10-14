export type ParticleShape =
  'sphere' | 'scatter' | 'torus' | 'pyramid' | 'organic';
export const PARTICLE_COUNT = 2200;
export const SHAPE_DURATION = 9;
export const DATA_DURATION = 3;
export const MORPH_DURATION = 1.65;
export const SHAPE_SEQUENCE: ParticleShape[] = [
  'sphere',
  'scatter',
  'torus',
  'scatter',
  'pyramid',
  'scatter',
  'organic',
  'scatter',
];
export const SHAPE_LABELS: Record<ParticleShape, string> = {
  sphere: 'Esfera de partículas',
  scatter: 'Mapa de superficie 3D',
  torus: 'Dona de partículas',
  pyramid: 'Pirámide de partículas',
  organic: 'Esfera irregular',
};

// Semillas estables: cada punto conserva su identidad al cambiar de geometría.
export function particleSeed(index: number, salt = 0) {
  let value = Math.imul(index + 1, 0x45d9f3b) ^ Math.imul(salt + 1, 0x27d4eb2d);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}

export function createShape(
  shape: ParticleShape,
  revision = 0,
  count = PARTICLE_COUNT,
) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = particleSeed(i),
      v = particleSeed(i, 1),
      w = particleSeed(i, 2);
    const phi = Math.acos(1 - 2 * u),
      theta = v * Math.PI * 2;
    let x = 0,
      y = 0,
      z = 0;
    if (shape === 'scatter') {
      const n = Math.ceil(Math.sqrt(count));
      const sx = ((i % n) / (n - 1)) * 3.2 - 1.6;
      const sz = (Math.floor(i / n) / (n - 1)) * 3.2 - 1.6;
      [x, y, z] = projectSurface(sx, surfaceHeight(sx, sz, revision), sz);
    } else if (shape === 'torus') {
      const ring = theta,
        tube = phi * 2;
      x = (1.28 + 0.48 * Math.cos(tube)) * Math.cos(ring);
      const yy = (1.28 + 0.48 * Math.cos(tube)) * Math.sin(ring);
      const zz = 0.48 * Math.sin(tube);
      y = yy * Math.cos(0.65) - zz * Math.sin(0.65);
      z = yy * Math.sin(0.65) + zz * Math.cos(0.65);
    } else if (shape === 'pyramid') {
      const corners = [
        [-1.5, -1.3, -1.5],
        [1.5, -1.3, -1.5],
        [1.5, -1.3, 1.5],
        [-1.5, -1.3, 1.5],
      ];
      const face = i % 4,
        a = corners[face],
        b = corners[(face + 1) % 4];
      const t = Math.sqrt(u),
        s = v;
      x = t * ((1 - s) * a[0] + s * b[0]);
      y = (1 - t) * 1.9 + t * -1.3;
      z = t * ((1 - s) * a[2] + s * b[2]);
      const xx = x * Math.cos(0.45) + z * Math.sin(0.45);
      z = -x * Math.sin(0.45) + z * Math.cos(0.45);
      x = xx;
    } else {
      const radius =
        1.75 *
        (0.88 + w * 0.12) *
        (shape === 'organic'
          ? 1 +
            0.2 * Math.sin(theta * 3) * Math.sin(phi * 2) +
            0.1 * Math.cos(phi * 5)
          : 1);
      x = radius * Math.sin(phi) * Math.cos(theta);
      y = radius * Math.cos(phi);
      z = radius * Math.sin(phi) * Math.sin(theta);
    }
    positions.set([x, y, z], i * 3);
  }
  return positions;
}

export function surfaceHeight(x: number, z: number, revision: number) {
  const phase = revision * 0.7;
  return (
    Math.sin(x * 1.35 + phase) * Math.cos(z * 1.1 - phase * 0.6) * 0.8 +
    Math.sin(z * 1.8 + x * 0.6 + phase) * 0.25
  );
}

export function projectSurface(
  x: number,
  y: number,
  z: number,
): [number, number, number] {
  const angle = -0.58,
    tilt = 0.66;
  const xx = x * Math.cos(angle) + z * Math.sin(angle);
  const zz = -x * Math.sin(angle) + z * Math.cos(angle);
  return [
    xx,
    y * Math.cos(tilt) - zz * Math.sin(tilt),
    y * Math.sin(tilt) + zz * Math.cos(tilt),
  ];
}

export function surfaceValues(revision = 0, count = PARTICLE_COUNT) {
  const n = Math.ceil(Math.sqrt(count));
  return Float32Array.from({ length: count }, (_, i) => {
    const x = ((i % n) / (n - 1)) * 3.2 - 1.6,
      z = (Math.floor(i / n) / (n - 1)) * 3.2 - 1.6;
    return Math.max(
      0,
      Math.min(1, (surfaceHeight(x, z, revision) + 1.05) / 2.1),
    );
  });
}
