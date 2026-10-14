export type Profile = {
  name: string;
  initials: string;
  role: string;
  introduction: string;
  email?: string;
  github?: string;
  linkedin?: string;
  cv?: string;
};

export const profile: Profile = {
  name: 'Andree Levario',
  initials: 'AL',
  role: 'Ingeniero en Informática',
  introduction:
    'Apasionado por los datos, el desarrollo web y la creación de experiencias 3D en la web.',
  // Añadir solo recursos y URLs reales proporcionados por Andree.
};

export const specialties = [
  {
    id: 'datos',
    title: 'Data Science',
    icon: 'chart',
    description:
      'De los datos a las ideas. Análisis, visualizaciones y modelos predictivos.',
    skills: ['Python', 'Análisis de datos', 'Visualización'],
    href: '#sobre-mi',
  },
  {
    id: 'web',
    title: 'Desarrollo web',
    icon: 'code',
    description:
      'Aplicaciones pensadas para las personas. Modernas, rápidas y responsivas.',
    skills: ['React', 'Next.js', 'TypeScript'],
    href: '#proyectos',
  },
  {
    id: '3d',
    title: 'WebGL / Three.js',
    icon: 'box',
    description:
      'Una nueva dimensión para la web. Experiencias 3D que invitan a explorar.',
    skills: ['Three.js', 'React Three Fiber', 'WebGL'],
    href: '#inicio',
  },
] as const;
