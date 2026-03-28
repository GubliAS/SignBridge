import type { NextRequest } from 'next/server';
import { LANGUAGES, type Lang } from '@/lib/signs';

// GhanaNLP API reference (PhidLarkson/Ghana-NLP-Python-Library):
//   Translate: POST https://translation-api.ghananlp.org/v1/translate
//              body: { in: string, lang: string }   e.g. "en-tw", "en-ee", "en-gaa"
//   TTS:       POST https://translation-api.ghananlp.org/tts/v1/tts
//              body: { text: string, language: string }   e.g. "tw", "ee", "gaa"
//              response: raw audio binary (not JSON)
// One API key covers all endpoints via Ocp-Apim-Subscription-Key header.

const BASE = 'https://translation-api.ghananlp.org';

function ghanaNlpHeaders(apiKey: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Ocp-Apim-Subscription-Key': apiKey,
  };
}

interface TranslateRequestBody {
  label: string;
  lang:  Lang;
}

export interface TranslateResponseBody {
  displayText: string;
  audio:       string | null; // base64-encoded audio; null for English (client uses speechSynthesis)
  lang:        Lang;
}

/** Ordered keys: primary first, then fallback (deduped if both set to the same value). */
function ghanaNlpApiKeys(): string[] {
  const primary = process.env.GHANANLP_API_KEY?.trim();
  const fallback = process.env.GHANANLP_API_KEY_FALLBACK?.trim();
  const out: string[] = [];
  for (const k of [primary, fallback]) {
    if (k && !out.includes(k)) out.push(k);
  }
  return out;
}

async function translateAndTts(
  label: string,
  lang: Exclude<Lang, 'en'>,
  apiKey: string,
): Promise<{ ok: true; body: TranslateResponseBody } | { ok: false; detail: string }> {
  const langMeta = LANGUAGES[lang];
  const headers = ghanaNlpHeaders(apiKey);

  // Step 1: Translate English label → target language text
  const translateRes = await fetch(`${BASE}/v1/translate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ in: label, lang: langMeta.translateTo }),
  });

  if (!translateRes.ok) {
    return {
      ok: false,
      detail: `Translate failed: ${translateRes.status}`,
    };
  }

  const translatedText = (await translateRes.json()) as string;

  // Step 2: Convert translated text → audio binary
  const ttsRes = await fetch(`${BASE}/tts/v1/tts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text: translatedText, language: langMeta.ttsCode }),
  });

  if (!ttsRes.ok) {
    return {
      ok: false,
      detail: `TTS failed: ${ttsRes.status}`,
    };
  }

  const audioBuffer = await ttsRes.arrayBuffer();
  const audioBase64 = Buffer.from(audioBuffer).toString('base64');

  return {
    ok: true,
    body: {
      displayText: translatedText,
      audio: audioBase64,
      lang,
    },
  };
}

export async function POST(request: NextRequest): Promise<Response> {
  const { label, lang } = (await request.json()) as TranslateRequestBody;

  if (!label) {
    return Response.json({ error: 'Missing label' }, { status: 400 });
  }

  // English: no API call needed — client handles via window.speechSynthesis
  if (lang === 'en') {
    const body: TranslateResponseBody = { displayText: label, audio: null, lang: 'en' };
    return Response.json(body);
  }

  const keys = ghanaNlpApiKeys();
  if (keys.length === 0) {
    return Response.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    let lastDetail = 'Translation failed';

    for (let i = 0; i < keys.length; i++) {
      const apiKey = keys[i];
      const result = await translateAndTts(label, lang, apiKey);

      if (result.ok) {
        return Response.json(result.body);
      }

      lastDetail = result.detail;
      if (i < keys.length - 1) {
        console.warn('[/api/translate] Key failed (%s), trying fallback', result.detail);
      }
    }

    console.error('[/api/translate]', lastDetail);
    return Response.json({ error: lastDetail }, { status: 500 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Translation failed';
    console.error('[/api/translate]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
