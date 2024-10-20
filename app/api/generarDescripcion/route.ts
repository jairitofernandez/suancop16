// app/api/generarDescripcion/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  const { nombreUsuario, nombreAnimal } = await request.json();

  const prompt = `Genera una descripción corta, graciosa y sarcástica, con pocos signos de puntuación y enfoque en la naturaleza que compare a ${nombreUsuario} con el animal ${nombreAnimal}, en tono humorístico.`;

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

    const messageContent = completion.choices[0]?.message?.content;

    if (!messageContent) {
      throw new Error('No se recibió una respuesta válida del modelo de IA.');
    }

    const descripcion = messageContent.trim();
    return NextResponse.json({ descripcion });
  } catch (error: unknown) {
    console.error('Error al generar la descripción:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
