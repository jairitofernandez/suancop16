// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };
    getUser();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Hola, estoy en COP16 con SUAN</h1>
      <p>Bienvenido a nuestra aplicación.</p>
    </div>
  );
}
