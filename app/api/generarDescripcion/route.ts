// app/api/generarDescripcion/route.ts
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  const { nombreUsuario, nombreAnimal } = await request.json();

  const prompt = `Genera una descripción corta y graciosa que compare a ${nombreUsuario} con el animal ${nombreAnimal}, en tono humorístico.`;

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 60,
    });

    const descripcion = completion.data.choices[0].text?.trim();
    return NextResponse.json({ descripcion });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
