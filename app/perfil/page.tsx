// app/perfil/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
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

interface Coleccion {
  animal_id: number;
  Animales: Animal[];
}

export default function PerfilPage() {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };
    getUser();
  }, []);

  useEffect(() => {
    const obtenerAnimales = async () => {
      if (user) {
        const { data } = await supabase
          .from('Colecciones')
          .select('animal_id, Animales(*)')
          .eq('usuario_id', user.id);

        if (data) {
          const animalesObtenidos = data.flatMap((item: Coleccion) => item.Animales);
          setAnimales(animalesObtenidos);
        }
      }
    };
    obtenerAnimales();
  }, [user]);

  if (!user) {
    return <p>Por favor, inicia sesión para ver tu perfil.</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Mi Colección</h1>
      {animales.map((animal) => (
        <div key={animal.id} className="mt-4">
          <h2 className="text-xl">{animal.nombre_comun}</h2>
          <Image
            src={animal.imagen_url}
            alt={animal.nombre_comun}
            width={192}
            height={192}
            className="w-48 h-auto"
          />
        </div>
      ))}
    </div>
  );
}
