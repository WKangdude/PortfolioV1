import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';
export const alt = 'Andree Levario, Ingeniero en Informática';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#f8f8f6',
        display: 'flex',
        flexDirection: 'column',
        padding: '90px',
        justifyContent: 'center',
        color: '#202724',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 24,
          color: '#557361',
          marginBottom: 30,
        }}
      >
        Datos. Código. Nuevas dimensiones.
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 82,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        {profile.name}
      </div>
      <div style={{ display: 'flex', fontSize: 32, marginTop: 20 }}>
        {profile.role}
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 22,
          marginTop: 70,
          color: '#68716b',
        }}
      >
        Portafolio personal
      </div>
    </div>,
    size,
  );
}
