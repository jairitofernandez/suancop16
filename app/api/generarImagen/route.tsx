// app/api/generarImagen/route.tsx
/* eslint-disable @next/next/no-img-element */

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

  const baseUrl = 
    process.env.NODE_ENV === 'production'
      ? process.env.URL_VERCEL
      : process.env.URL_LOCAL;

  // Obtener el archivo de la fuente Poppins Bold desde tu servidor
  const poppinsBoldFont = await fetch(
    `${baseUrl}/template/Poppins-Bold.ttf`
  ).then((res) => res.arrayBuffer());

  const imageUrl = `${baseUrl}/images/${imagenNombre}`;
  const templateUrl = `${baseUrl}/template/template.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '576px',
          height: '1024px',
          display: 'flex',
          flexDirection: 'column',
          color: '#000',
          fontSize: '30px',
          fontFamily: 'Poppins, Arial, sans-serif',
          textAlign: 'left',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Imagen de fondo sin padding */}
        <img
          src={templateUrl}
          alt="background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />

        {/* Contenedor principal con z-index superior */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '20px',
          }}
        >
          {/* Contenedor para imagen y texto separados */}
          <div style={{ display: 'flex', width: '100%', marginTop: '178px' }}>
            {/* Contenedor de texto alineado a la izquierda */}
            <div
              style={{
                flex: 1,
                marginLeft: '15px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h1
                style={{
                  fontSize: '46px',
                  marginTop: '30px',
                  marginBottom: '10px',
                  fontFamily: 'Poppins',
                }}
              >
                {nombreAnimal}
              </h1>
              <h2
                style={{
                  fontSize: '34px',
                  fontStyle: 'italic',
                  fontFamily: 'Poppins',
                }}
              >
                {nombreCientifico}
              </h2>
            </div>

            {/* Imagen circular alineada a la derecha */}
            <div
              style={{
                width: '210px',
                height: '210px',
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '7px',
              }}
            >
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
          </div>

          {/* Sección de descripción debajo del título */}
          <div
            style={{
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '15px',
              marginTop: '20px',
              borderRadius: '8px',
            }}
          >
            <p style={{ fontSize: '26px', margin: '0', fontFamily: 'Poppins' }}>
              {descripcion}
            </p>
            <p
              style={{
                fontSize: '26px',
                fontWeight: 'bold',
                marginTop: '20px',
                fontFamily: 'Poppins',
              }}
            >
              {descripcionPersonalizada}
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 576,
      height: 1024,
      fonts: [
        {
          name: 'Poppins',
          data: poppinsBoldFont,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
}
