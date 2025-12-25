import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/apiConfig';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image manquante' }, { status: 400 });
    }

    if (!API_CONFIG.CLARIFAI.API_KEY || API_CONFIG.CLARIFAI.API_KEY === 'YOUR_CLARIFAI_API_KEY_HERE') {
      return NextResponse.json({ error: 'Clé API Clarifai manquante' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.clarifai.com/v2/models/${API_CONFIG.CLARIFAI.MODEL_ID}/outputs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${API_CONFIG.CLARIFAI.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_app_id: {
            user_id: API_CONFIG.CLARIFAI.USER_ID,
            app_id: API_CONFIG.CLARIFAI.APP_ID,
          },
          inputs: [
            {
              data: {
                image: {
                  base64: imageBase64.split(',')[1],
                },
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur Clarifai:', errorData);
      return NextResponse.json({ error: 'Erreur API Clarifai' }, { status: 500 });
    }

    const data = await response.json();
    const concepts = data.outputs[0]?.data?.concepts || [];

    return NextResponse.json({ concepts });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
