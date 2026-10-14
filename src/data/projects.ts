export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  url?: string;
  repository?: string;
  contribution?: string;
  result?: string;
  technologies?: string[];
};
export const projects: Project[] = [
  {
    id: 'foodlify',
    title: 'Foodlify',
    category: 'Plataforma para restaurantes',
    description:
      'Una plataforma impulsada por IA que conecta la gestión del restaurante, el menú y las comandas con la cocina en tiempo real.',
    features: ['Gestión con IA', 'Menú digital', 'Comandas en tiempo real'],
    // Tecnologías, contribución, resultados y enlaces pendientes de confirmación.
  },
];
