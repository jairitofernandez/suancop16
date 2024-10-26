// app/api/generarImagen/route.tsx
/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nombreUsuario = searchParams.get('usuario') || '';
  const nombreAnimal = searchParams.get('animal') || 'Animal';
  const nombreCientifico = searchParams.get('cientifico') || '';
  const descripcion = searchParams.get('descripcion') || '';
  const descripcionPersonalizada = searchParams.get('personalizada') || '';
  const imagenNombre = searchParams.get('imagenNombre') || '';

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.URL_VERCEL
      : process.env.URL_LOCAL;

  // Obtener el archivo de la fuente Poppins Bold desde el servidor
  const poppinsBoldFont = await fetch(
    `${baseUrl}/template/Poppins-Bold.ttf`
  ).then((res) => res.arrayBuffer());

  const imageUrl = `${baseUrl}/images/${imagenNombre}`;
  const templateUrl = `${baseUrl}/template/template.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '576px',                  // Ancho total de la imagen generada
          height: '1024px',                // Altura total de la imagen generada
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
            objectFit: 'cover',           // Ajuste para cubrir toda la imagen de fondo
            zIndex: 0,
          }}
        />

        {/* Contenedor principal de contenido */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '20px',              // Espaciado general alrededor del contenedor
          }}
        >
          {/* Contenedor para imagen y texto separados */}
          <div style={{ display: 'flex', width: '100%', marginTop: '10px' }}>
            {/* Contenedor de texto alineado a la izquierda */}
            <div
              style={{
                flex: 1,
                marginLeft: '11px',         // Margen izquierdo para el bloque de texto
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Nombre del Usuario */}
              <h1
                style={{
                  fontSize: '45px',         // Tamaño de fuente del nombre del usuario
                  marginTop: '67px',         // Ajusta el margen superior según sea necesario
                  marginBottom: '5px',      // Espacio inferior con el nombre del animal
                  fontFamily: 'Poppins',
                  color: '#5c8739',
                }}
              >
                {nombreUsuario}
              </h1>

              {/* Nombre del Animal */}
              <h1
                style={{
                  fontSize: '35px',             // Tamaño de fuente del nombre del animal
                  marginBottom: '5px',         // Espacio inferior con el nombre científico
                  marginTop: '55px',            // Margen superior
                  fontFamily: 'Poppins',
                  backgroundColor: '#172b13',   // Color de fondo de la píldora
                  color: '#E4E7D5', // Transparencia de texto (si no, cambiar a '#FFFFFF')
                  WebkitTextStroke: '1px #FFFFFF', // Contorno blanco en texto para mantener visibilidad
                  padding: '5px 10px 5px 5px',          // Espaciado interno para lograr forma de píldora
                  borderRadius: '50px',         // Bordes redondeados en forma de píldora
                  textAlign: 'left',
                }}
              >
                {nombreAnimal}
              </h1>

              {/* Nombre Científico */}
              <h2
                style={{
                  fontSize: '22px',             // Tamaño de fuente del nombre del animal
                  marginBottom: '5px',         // Espacio inferior con el nombre científico
                  marginTop: '10px',            // Margen superior
                  fontFamily: 'Poppins',
                  backgroundColor: '#172b13',   // Color de fondo de la píldora
                  color: '#E4E7D5', // Transparencia de texto (si no, cambiar a '#FFFFFF')
                  WebkitTextStroke: '1px #FFFFFF', // Contorno blanco en texto para mantener visibilidad
                  padding: '5px 10px 5px 5px',          // Espaciado interno para lograr forma de píldora
                  borderRadius: '50px',         // Bordes redondeados en forma de píldora
                  textAlign: 'center',
                }}
              >
                {nombreCientifico}
              </h2>
            </div>

            {/* Imagen circular alineada a la derecha */}
            <div
              style={{
                width: '210px',             // Tamaño de la imagen circular
                height: '210px',            // Tamaño de la imagen circular
                borderRadius: '50%',        // Borde circular para la imagen del animal
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '7px',  
                marginTop:'168'       // Margen derecho para espacio con el borde
              }}
            >
              <img
                src={imageUrl}
                alt={nombreAnimal}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',        // Mantiene las proporciones de la imagen
                }}
              />
            </div>
          </div>

          {/* Sección de descripción debajo del título */}
          <div
            style={{
              padding: '10px',             // Espacio interno del contenedor de descripción
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '15px',          // Margen izquierdo para alinear con otros campos
              marginTop: '20px',           // Margen superior con el título científico
              borderRadius: '8px',         // Bordes redondeados del contenedor de descripción
              fontFamily: 'Poppins',
              color: '#2d5528',
            }}
          >
            {/* Descripción general */}
            <p style={{ fontSize: '26px', margin: '0', fontFamily: 'Poppins' }}>
              {descripcion}
            </p>

            {/* Descripción personalizada */}
            <p
              style={{
                fontSize: '26px',
                fontWeight: 'bold',
                marginTop: '20px',         // Margen superior para separar de la descripción principal
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
      width: 576,                           // Ancho final de la imagen generada
      height: 1024,                         // Altura final de la imagen generada
      fonts: [
        {
          name: 'Poppins',                  // Nombre de la fuente
          data: poppinsBoldFont,            // Datos de la fuente cargados desde el servidor
          weight: 700,                      // Peso de la fuente
          style: 'normal',                  // Estilo normal
        },
      ],
    }
  );
}
