// app/login/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      router.push('/perfil');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block mt-4 p-2 border border-gray-300"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block mt-2 p-2 border border-gray-300"
      />
      <button onClick={handleLogin} className="mt-4 px-4 py-2 bg-blue-500 text-white">
        Iniciar Sesión
      </button>
    </div>
  );
}
