// app/[grupo]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';

interface Animal {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  url_imagen: string;
  enlace_qr: string;
}

export default function GrupoPage() {
  const params = useParams();
  const grupo = params.grupo as string;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [descripcionPersonalizada, setDescripcionPersonalizada] = useState('');
  const [generando, setGenerando] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mostrarPopup, setMostrarPopup] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchAnimal = async () => {
      const { data: animales } = await supabase
        .from('animales')
        .select('*')
        .eq('enlace_qr', grupo);

      if (animales && animales.length > 0) {
        const animalAleatorio =
          animales[Math.floor(Math.random() * animales.length)];
        setAnimal(animalAleatorio);
      } else {
        setAnimal(null);
      }
    };
    fetchAnimal();
  }, [grupo]);

  useEffect(() => {
    setTimeout(() => setMostrarPopup(true), 2000);
  }, []);

  const generarDescripcion = async () => {
    if (!nombreUsuario) {
      alert('Por favor, ingresa tu nombre.');
      return;
    }

    const nombreFormateado = nombreUsuario
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());

    setGenerando(true);

    try {
      const response = await fetch('/api/generarDescripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreUsuario: nombreFormateado,
          nombreAnimal: animal?.nombre_comun,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDescripcionPersonalizada(data.descripcion);

        if (user && animal) {
          await supabase.from('Colecciones').insert([
            {
              usuario_id: user.id,
              animal_id: animal.id,
            },
          ]);
        }

        // Inserción en la tabla `registro_consultas`
        await supabase.from('registro_consultas').insert([
          {
            nombre_animal: animal?.nombre_comun,
            nombre_cientifico: animal?.nombre_cientifico,
            nombre_persona: nombreFormateado,
            descripcion_generada: data.descripcion,
            imagen_generada: false,
          },
        ]);
      } else {
        alert('Error al generar la descripción: ' + data.error);
      }
    } catch (error: unknown) {
      console.error('Error en la solicitud:', error);
      alert('Ocurrió un error al generar la descripción.');
    }

    setGenerando(false);
    setMostrarPopup(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      generarDescripcion();
    }
  };

  if (!animal) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#5c8739] text-white text-center font-bold text-2xl">
        <p>Buscando una de las especies importante para la COP16...</p>
        <span className="ml-4 animate-spin border-t-2 border-white rounded-full w-6 h-6"></span>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center min-h-screen p-8"
      style={{
        backgroundImage: 'url("/template/fondo.png")',
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100px',
        backgroundPosition: 'bottom',
        backgroundColor: '#c4d2c2',
        fontFamily: 'Poppins, sans-serif',
      }}
      >
      {/* Logo en la parte superior */}
      <div className="mb-1">
        <Image src="/template/logo.png" alt="Logo" width={150} height={95} />
      </div>

      {/* Texto #estoyenCOP16 */}
      <h2 className="text-3xl font-bold text-[#c1633a] mb-1">#estoyenCOP16</h2>

      {/* Contenedor de la imagen con nombres superpuestos */}
      <div className="relative flex items-center justify-center mt-4">
        <div className="rounded-full overflow-hidden w-72 h-72 border-8" style={{ borderColor: '#e4e7d5' }}>
          <Image
            src={animal.url_imagen}
            alt={animal.nombre_comun}
            width={288}
            height={288}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Nombre del animal superpuesto, sin espacio vertical */}
        <div className="absolute -bottom-14 flex flex-col items-center w-full text-center space-y-0">
          <h1 className="text-2xl font-bold text-white bg-[#c1633a] bg-opacity-90 px-4 py-1 rounded-full">{animal.nombre_comun}</h1>
          <div className="bg-[#172b13] text-[#E4E7D5] italic px-4 py-1 mt-1 rounded-full text-sm">
            {animal.nombre_cientifico}
          </div>
        </div>
      </div>

      <p className="text-lg mt-16 text-center px-6 text-white">{animal.descripcion}</p>

      {/* Descripción personalizada */}
      {descripcionPersonalizada && (
        <div className="mt-6 w-80 bg-white p-4 rounded text-center shadow">
          <h3 className="font-semibold text-[#5c8739]">Descripción Personalizada:</h3>
          <p className="mt-2 text-[#2d5528]">{descripcionPersonalizada}</p>
          
          <a
            href={`/api/generarImagen?usuario=${encodeURIComponent(
              nombreUsuario
            )}&animal=${encodeURIComponent(animal.nombre_comun)}&cientifico=${encodeURIComponent(
              animal.nombre_cientifico
            )}&descripcion=${encodeURIComponent(animal.descripcion)}&personalizada=${encodeURIComponent(
              descripcionPersonalizada
            )}&imagenNombre=${encodeURIComponent(animal.url_imagen.split('/').pop() || '')}`}
            download="cop16suanimage.png"
            className="inline-block mt-4 px-4 py-2 bg-[#c1633a] text-white rounded"
          >
            Descargar Imagen para compartir
          </a>
        </div>
      )}

      {/* Input y botón debajo de la descripción personalizada */}
      <div className="mt-6 w-full flex flex-col items-center">
        <input
          type="text"
          placeholder="Escribe tu nombre para buscar tu match ecológico personalizado"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          onKeyDown={handleKeyPress}
          className="p-3 text-[#5c8739] border border-gray-300 rounded w-80 text-center"
        />
        
        <button
          onClick={generarDescripcion}
          disabled={generando}
          className="mt-4 px-6 py-3 bg-[#c1633a] text-white rounded"
        >
          {generando ? 'Buscando...' : '¡Buscar mi match ecológico!'}
        </button>
      </div>

      

      {/* Popup para nombre de usuario */}
      {mostrarPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg text-center w-80 relative">
            <button
              onClick={() => setMostrarPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold text-[#5c8739]">¡Hola!</h3>
            <p className="mt-2 text-[#2d5528]">Ingresa tu nombre para una experiencia personalizada.</p>
            <input
              type="text"
              placeholder="Tu Nombre"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              onKeyDown={handleKeyPress}
              className="mt-4 p-3 text-[#2d5528] border border-gray-300 rounded w-full text-center"
            />
            <button
              onClick={generarDescripcion}
              disabled={generando}
              className="mt-4 px-6 py-3 bg-[#c1633a] text-white rounded"
            >
              {generando ? 'Generando...' : 'Empezar'}
            </button>
          </div>
        </div>
      )}

      {/* Botón de Trivia Verde */}
      <div className="mt-8 p-6 bg-[#e0f5d5] border-2 border-[#5c8739] rounded-lg shadow-lg text-center">
        <p className="text-xl text-[#5c8739] mb-4">
         <b> ¡Atrévete a probar la Trivia Verde!</b> Donde aprender sobre especies en peligro es un juego emocionante. 
          Aquí tendrás la oportunidad de conocer más sobre la biodiversidad de Colombia mientras te diviertes.
        </p>
        <a
          href="https://udify.app/chat/K9ikaA1JS9jN1Gr0"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-[#c1633a] text-white rounded-lg font-bold text-lg shadow hover:bg-[#9b3f2a] transition duration-200 ease-in-out"
        >
          ¡Iniciar Trivia Verde!
        </a>
      </div>

      {!user && descripcionPersonalizada && (
        <div className="mt-8 text-center">
          <p className="font-bold text-[#c1633a]">
            ¡Regístrate para coleccionar este animal y ver tu colección completa!
          </p>
          <Link href="/register" className="px-6 py-3 bg-[#c1633a] text-white rounded mt-2 inline-block">
            Registrarse
          </Link>
        </div>
      )}

    </div>
  );
}
