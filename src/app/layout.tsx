import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import '@/styles/globals.css';
import { profile } from '@/data/profile';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ),
  title: `${profile.name} — ${profile.role}`,
  description: profile.introduction,
  openGraph: {
    title: `${profile.name} — Portafolio`,
    description: profile.introduction,
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — Portafolio`,
    description: profile.introduction,
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('portfolio-theme-v1');document.documentElement.dataset.theme=t==='dark'||t==='light'?t:window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
