// app/perfil/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function PerfilPage() {
  const [animales, setAnimales] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

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
          setAnimales(data.map((item: any) => item.Animales));
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
          <img src={animal.imagen_url} alt={animal.nombre_comun} className="w-48 h-auto" />
        </div>
      ))}
    </div>
  );
}
