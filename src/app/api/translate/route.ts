import type { NextRequest } from 'next/server';

interface TranslateRequestBody {
  label: string;
  lang: 'tw';
}

interface TranslateResponseBody {
  translation: string;
  audio: string; // base64-encoded MP3
}

export async function POST(request: NextRequest): Promise<Response> {
  const body = (await request.json()) as TranslateRequestBody;
  const { label, lang } = body;

  if (!label || lang !== 'tw') {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const apiKey = process.env.GHANANLP_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 });
  }

  // Stub — GhanaNLP translate + TTS calls implemented in a later step.
  const responseBody: TranslateResponseBody = { translation: label, audio: '' };
  return Response.json(responseBody);
}
