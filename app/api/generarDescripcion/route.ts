// app/api/generarDescripcion/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs'; // Cambiado a 'nodejs'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  const { nombreUsuario, nombreAnimal } = await request.json();

  const prompt = `Genera una descripción corta y graciosa que compare a ${nombreUsuario} con el animal ${nombreAnimal}, en tono humorístico.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 60,
    });

    const descripcion = completion.choices[0].message?.content.trim();
    return NextResponse.json({ descripcion });
  } catch (error: any) {
    console.error('Error al generar la descripción:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
