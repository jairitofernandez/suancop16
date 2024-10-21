// app/[grupo]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

interface Animal {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  imagen_url: string;
  grupo_qr: string;
}

export default function GrupoPage() {
  const params = useParams();
  const grupo = params.grupo as string;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [descripcionPersonalizada, setDescripcionPersonalizada] = useState('');
  const [generando, setGenerando] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
        .eq('grupo_qr', grupo);

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

  const generarDescripcion = async () => {
    if (!nombreUsuario) {
      alert('Por favor, ingresa tu nombre.');
      return;
    }

    setGenerando(true);

    try {
      const response = await fetch('/api/generarDescripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreUsuario,
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
      } else {
        alert('Error al generar la descripción: ' + data.error);
      }
    } catch (error: unknown) {
      console.error('Error en la solicitud:', error);
      alert('Ocurrió un error al generar la descripción.');
    }

    setGenerando(false);
  };

  // Función para extraer el nombre de la imagen
  function getImageFileName(url: string): string {
    return url.split('/').pop() || '';
  }

  if (!animal) {
    return (
      <div className="p-8">
        <h1>Error</h1>
        <p>No se pudo encontrar un animal para el grupo especificado.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{animal.nombre_comun}</h1>
      <h2 className="italic">{animal.nombre_cientifico}</h2>
      <Image
        src={animal.imagen_url}
        alt={animal.nombre_comun}
        width={256}
        height={256}
        className="w-64 h-auto"
      />
      <p>{animal.descripcion}</p>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Tu Nombre"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          className="p-2 border border-gray-300"
        />
        <br />
        <button
          onClick={generarDescripcion}
          disabled={generando}
          className="mt-2 px-4 py-2 bg-blue-500 text-white"
        >
          {generando ? 'Generando...' : 'Generar Descripción Personalizada'}
        </button>
      </div>

      {descripcionPersonalizada && (
        <div className="mt-6">
          <h3 className="font-semibold">Descripción Personalizada:</h3>
          <p>{descripcionPersonalizada}</p>

          <a
            href={`/api/generarImagen?animal=${encodeURIComponent(
              animal.nombre_comun
            )}&cientifico=${encodeURIComponent(
              animal.nombre_cientifico
            )}&descripcion=${encodeURIComponent(
              animal.descripcion
            )}&personalizada=${encodeURIComponent(
              descripcionPersonalizada
            )}&imagenNombre=${encodeURIComponent(
              getImageFileName(animal.imagen_url)
            )}`}
            download="animal.png"
            className="inline-block mt-4 px-4 py-2 bg-green-500 text-white"
          >
            Descargar Imagen
          </a>
        </div>
      )}

      {!user && descripcionPersonalizada && (
        <div className="mt-8">
          <p>
            <strong>
              ¡Regístrate para coleccionar este animal y ver tu colección
              completa!
            </strong>
          </p>
          <a
            href="/register"
            className="px-4 py-2 bg-indigo-500 text-white"
          >
            Registrarse
          </a>
        </div>
      )}
    </div>
  );
}
