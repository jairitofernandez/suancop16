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
          width: '600px',
          height: '800px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          color: '#000',
          padding: '20px',
        }}
      >
        <img src={imagenURL} alt={nombreAnimal} style={{ width: '100%', height: 'auto' }} />
        <h1>{nombreAnimal}</h1>
        <h2>{nombreCientifico}</h2>
        <p>{descripcion}</p>
        <p>{descripcionPersonalizada}</p>
      </div>
    ),
    {
      width: 600,
      height: 800,
    }
  );
}
