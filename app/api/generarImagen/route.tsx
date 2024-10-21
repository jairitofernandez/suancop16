// app/api/generarImagen/route.tsx
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nombreAnimal = searchParams.get('animal') || 'Animal';
  const nombreCientifico = searchParams.get('cientifico') || '';
  const descripcion = searchParams.get('descripcion') || '';
  const descripcionPersonalizada = searchParams.get('personalizada') || '';
  const imagenNombre = searchParams.get('imagenNombre') || '';

  // Definir manualmente la URL base para producción
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://suancop16.vercel.app'
    : 'http://localhost:3000';

  // URL absoluta de la imagen
  const imageUrl = `${baseUrl}/images/${imagenNombre}`;

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
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        {/* Sección de la imagen del animal */}
        <div style={{ flex: '1', position: 'relative', display: 'flex' }}>
          <img
            src={imageUrl}
            alt={nombreAnimal}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        {/* Sección de texto */}
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
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

