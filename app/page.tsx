// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import Image from 'next/image';

interface Animal {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  url_imagen: string;
  enlace_qr: string;
}

export default function Home() {
  const router = useRouter();
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // Redirigir automáticamente a la página /WYXOP
    router.push('/WYXOP');
  }, [router]);

  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        setDebugInfo('Intentando obtener animales...\n');
        console.log('URL de Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        
        // Intenta obtener la lista de tablas
        const { data: tablesData, error: tablesError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');

        if (tablesError) {
          setDebugInfo(prev => prev + `Error al obtener tablas: ${JSON.stringify(tablesError)}\n`);
        } else {
          setDebugInfo(prev => prev + `Tablas disponibles: ${JSON.stringify(tablesData)}\n`);
        }

        // Intenta obtener los datos de la tabla 'animales'
        const { data, error } = await supabase
          .from('animales')
          .select('*');
        
        if (error) {
          console.error('Error detallado:', error);
          setDebugInfo(prev => prev + `Error al obtener animales: ${JSON.stringify(error)}\n`);
          throw error;
        }
        
        console.log('Datos obtenidos:', data);
        setDebugInfo(prev => prev + `Datos obtenidos: ${JSON.stringify(data)}\n`);
        
        if (data && data.length > 0) {
          setAnimales(data);
        } else {
          setDebugInfo(prev => prev + 'No se obtuvieron datos de animales.\n');
          
          // Intenta una consulta simple para verificar la conexión
          const { data: testData, error: testError } = await supabase
            .from('animales')
            .select('count(*)', { count: 'exact' });
          
          if (testError) {
            setDebugInfo(prev => prev + `Error en consulta de prueba: ${JSON.stringify(testError)}\n`);
          } else {
            setDebugInfo(prev => prev + `Resultado de consulta de prueba: ${JSON.stringify(testData)}\n`);
          }
        }
      } catch (error: unknown) {
        console.error('Error al obtener los animales:', error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al obtener los animales';
        setError(errorMessage);
        setDebugInfo(prev => prev + `Error capturado: ${errorMessage}\n`);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimales();
  }, []);

  if (loading) return <p>Cargando animales...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Hola, estoy en COP16 con SUAN</h1>
      <p className="mb-6">Bienvenido a nuestra aplicación.</p>

      <h2 className="text-xl font-semibold mb-4">Lista de Animales</h2>
      {animales.length === 0 ? (
        <p>No se encontraron animales.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {animales.map((animal) => (
            <div key={animal.id} className="border p-4 rounded-lg shadow-md">
              <h3 className="font-bold">{animal.nombre_comun}</h3>
              <p className="text-sm italic">{animal.nombre_cientifico}</p>
              <p className="mt-2">{animal.descripcion}</p>
              <Image
                src={animal.url_imagen}
                alt={animal.nombre_comun}
                width={500}
                height={200}
                className="mt-2 w-full h-48 object-cover rounded"
              />
              <p className="mt-2">Grupo QR: {animal.enlace_qr}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Información de depuración:</h3>
        <pre className="whitespace-pre-wrap">{debugInfo}</pre>
      </div>
    </div>
  );
}
