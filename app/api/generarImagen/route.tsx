// app/api/generarImagen/route.tsx
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nombreAnimal = searchParams.get('animal') || 'Animal';
  const nombreCientifico = searchParams.get('cientifico') || '';
  const descripcion = searchParams.get('descripcion') || '';
  const descripcionPersonalizada = searchParams.get('personalizada') || '';
  const imagenURL = searchParams.get('imagen') || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '720px',
          height: '1280px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          color: '#000',
          fontSize: '32px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Sección de la imagen del animal */}
        <div style={{ flex: '1', position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagenURL}
            alt={nombreAnimal}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        {/* Sección de texto */}
        <div style={{ padding: '20px' }}>
          <h1 style={{ fontSize: '48px', margin: '0' }}>{nombreAnimal}</h1>
          <h2 style={{ fontSize: '36px', fontStyle: 'italic', margin: '0' }}>
            {nombreCientifico}
          </h2>
          <p style={{ fontSize: '28px', marginTop: '20px' }}>{descripcion}</p>
          <p
            style={{
              fontSize: '28px',
              marginTop: '20px',
              fontWeight: 'bold',
            }}
          >
            {descripcionPersonalizada}
          </p>
        </div>
      </div>
    ),
    {
      width: 720,
      height: 1280,
    }
  );
}
