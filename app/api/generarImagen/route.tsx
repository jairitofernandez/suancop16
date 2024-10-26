// app/api/generarImagen/route.tsx
/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export const runtime = 'edge';

function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function calculateDynamicFontSize(text: string, baseSize: number, maxWidth: number, approxCharWidth: number): number {
  const textLength = text.length;
  const estimatedWidth = textLength * approxCharWidth;

  if (estimatedWidth <= maxWidth) {
    return baseSize;
  }

  const scaleFactor = maxWidth / estimatedWidth;
  const minSize = Math.floor(baseSize * 0.6);
  return Math.max(minSize, Math.floor(baseSize * scaleFactor));
}

function calculateUsernameFontSize(text: string): number {
  return calculateDynamicFontSize(text, 45, 300, 25);
}

function calculateAnimalNameFontSize(text: string): number {
  return calculateDynamicFontSize(text, 35, 250, 20);
}

function calculateScientificNameFontSize(text: string): number {
  return calculateDynamicFontSize(text, 20, 250, 11);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nombreUsuario = capitalizeWords(searchParams.get('usuario') || '');
  const nombreAnimal = searchParams.get('animal') || 'Animal';
  const nombreCientifico = searchParams.get('cientifico') || '';
  const descripcion = searchParams.get('descripcion') || '';
  const descripcionPersonalizada = searchParams.get('personalizada') || '';
  const imagenNombre = searchParams.get('imagenNombre') || '';

  const usernameFontSize = calculateUsernameFontSize(nombreUsuario);
  const animalNameFontSize = calculateAnimalNameFontSize(nombreAnimal);
  const scientificNameFontSize = calculateScientificNameFontSize(nombreCientifico);
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.URL_VERCEL
      : process.env.URL_LOCAL;

  const poppinsBoldFont = await fetch(
    `${baseUrl}/template/Poppins-Bold.ttf`
  ).then((res) => res.arrayBuffer());

  const imageUrl = `${baseUrl}/images/${imagenNombre}`;
  const templateUrl = `${baseUrl}/template/template.jpg`;

  // Una vez generada la imagen, actualizamos el registro en `registro_consultas`
  await supabase
    .from('registro_consultas')
    .update({ imagen_generada: true })
    .eq('nombre_persona', nombreUsuario)
    .eq('nombre_animal', nombreAnimal);

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
          <div style={{ display: 'flex', width: '100%', marginTop: '10px' }}>
            <div
              style={{
                flex: 1,
                marginLeft: '11px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h1
                style={{
                  fontSize: `${usernameFontSize}px`,
                  marginTop: '80px',
                  marginBottom: '5px',
                  fontFamily: 'Poppins',
                  color: '#72c42f',
                  lineHeight: '0.9',
                }}
              >
                {nombreUsuario}
              </h1>

              {/* Hashtag COP16 */}
              <div
                style={{
                  fontSize: '32px',
                  fontFamily: 'Poppins',
                  color: '#c1633a',
                  marginTop: '8px',
                  marginBottom: '15px',
                }}
              >
                #estoyenCOP16
              </div>

              {/* Contenedor para el nombre del animal */}
              <div style={{ display: 'flex', marginTop: '25px', marginBottom: '5px' }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: '#172b13',
                    borderRadius: '25px',
                    padding: '5px 15px',
                  }}
                >
                  <div
                    style={{
                      fontSize: `${animalNameFontSize}px`,
                      fontFamily: 'Poppins',
                      color: '#E4E7D5',
                      WebkitTextStroke: '1px #FFFFFF',
                    }}
                  >
                    {nombreAnimal}
                  </div>
                </div>
              </div>

              {/* Contenedor para el nombre científico */}
              <div style={{ display: 'flex', marginTop: '10px', marginBottom: '5px' }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: '#172b13',
                    borderRadius: '25px',
                    padding: '5px 15px',
                  }}
                >
                  <div
                    style={{
                      fontSize: `${scientificNameFontSize}px`,
                      fontFamily: 'Poppins',
                      color: '#E4E7D5',
                      WebkitTextStroke: '1px #FFFFFF',
                    }}
                  >
                    {nombreCientifico}
                  </div>
                </div>
              </div>
            </div>

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
                marginTop: '168px'
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

          <div
            style={{
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '15px',
              marginTop: '20px',
              borderRadius: '8px',
              fontFamily: 'Poppins',
              color: '#2d5528',
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

          {/* Fecha fija en la esquina inferior izquierda */}
          <div
            style={{
              position: 'absolute',
              bottom: '100px',
              left: '35px',
              fontSize: '30px',
              fontFamily: 'Poppins',
              color: '#ffffff',
              fontWeight: 'bold',
            }}
          >
            Oct 2024
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
