export interface Env {
  GEMINI_API_KEY: string;
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
}

const scenarioPrompts: Record<string, string> = {
  alltag: 'Alltägliches Gespräch über Hobbys, Tagesablauf, Interessen und Pläne.',
  cafe: 'Rollenspiel in einem gemütlichen Berliner Café oder Restaurant (Bestellen, Wünsche, Bezahlung).',
  job: 'Professionelles Vorstellungsgespräch für eine Stelle in Deutschland (Erfahrungen, Stärken, Fragen des Personalers).',
  arzt: 'Arztbesuch: Symptome beschreiben, Fragen des Arztes beantworten, medizinische Ratschläge verstehen.',
  wohnung: 'Wohnungsbesichtigung & Gespräch mit dem Vermieter (Miete, Kaution, Ausstattung, Regeln).',
  einkauf: 'Einkaufen im Supermarkt oder Markt (Preise, Qualität, Reklamation).',
  pruefung: 'Vorbereitung auf die Goethe / telc B1-B2 mündliche Prüfung (Präsentationen, Bildbeschreibung, Meinungsäußerung).',
};

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: jsonHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          hasApiKey: !!env.GEMINI_API_KEY,
          platform: 'cloudflare-workers',
          timestamp: new Date().toISOString(),
        }),
        { headers: jsonHeaders }
      );
    }

    if (url.pathname === '/api/gemini/chat') {
      return handleChat(request, env);
    }

    if (url.pathname === '/api/gemini/evaluate') {
      return handleEvaluate(request, env);
    }

    if (url.pathname === '/api/gemini/tts') {
      return handleTTS(request, env);
    }

    if (url.pathname === '/api/gemini/transcribe') {
      return handleTranscribe(request, env);
    }

    // Serve static assets if in Cloudflare Workers with ASSETS binding
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};

async function handleChat(request: Request, env: Env): Promise<Response> {
  try {
    const { messages = [], scenario = 'alltag', level = 'B1' } = await request.json() as any;
    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY is not configured on Cloudflare Worker' }),
        { status: 500, headers: jsonHeaders }
      );
    }

    const scenarioDesc = scenarioPrompts[scenario] || scenarioPrompts.alltag;
    const systemInstruction = `
Du bist "Gemini DeutschLehrer" (جمینای معلم آلمانی), ein empathischer, motivierender und professioneller muttersprachlicher Deutschlehrer für persischsprachige Deutschlerner.
Der aktuelle Lernende hat das Sprachniveau: ${level}.
Aktuelles Thema / Szenario: ${scenarioDesc}.

Deine Hauptaufgaben:
1. Führe ein natürliches, lebendiges Gespräch auf Deutsch, das exakt zum Niveau ${level} passt.
2. Halte deine deutsche Antwort zielgerichtet, sympathisch und interaktiv (stelle am Ende eine offene Anschlussfrage).
3. Wenn der Benutzer Fehler gemacht hat (Grammatik, Wortstellung wie Verb an Position 2 oder Nebensatz am Ende, Dativ/Akkusativ, falsche Wörter), korrigiere ihn sanft und erkläre die Korrektur kurz auf Persisch.
4. Gib IMMER eine flüssige, natürliche persische Übersetzung deiner Antwort an.
5. Gib 2 bis 3 Antwortvorschläge (auf Deutsch mit persischer Übersetzung), die der Lerner als Nächstes sagen könnte.
6. Ziehe wichtige Vokabeln oder Redewendungen aus deiner Antwort heraus.

WICHTIG: Antworte AUSSCHLIESSLICH im folgenden JSON-Format ohne Markdown-Code-Blöcke (kein \`\`\`json):
{
  "replyGerman": "Deine deutsche Antwort hier.",
  "replyPersian": "ترجمه فارسی روان پاسخ تو در اینجا.",
  "corrections": [
    {
      "original": "جمله یا کلمه اشتباه کاربر",
      "corrected": "جمله تصحیح شده آلمانی",
      "explanationFa": "توضیح کوتاه و آموزنده به فارسی درباره دلیل اشتباه"
    }
  ],
  "scoreForUserMessage": {
    "overall": 85,
    "grammar": 80,
    "vocabulary": 85,
    "fluency": 90,
    "feedbackFa": "بازخورد تشویقی به فارسی"
  },
  "suggestedReplies": [
    { "german": "Option 1 auf Deutsch", "persian": "ترجمه فارسی گزینه ۱" },
    { "german": "Option 2 auf Deutsch", "persian": "ترجمه فارسی گزینه ۲" }
  ],
  "keyVocabulary": [
    { "german": "das Wort", "persian": "معنی کلمه", "type": "Nomen / Verb / etc." }
  ]
}
`;

    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemInstruction + '\n\nBisheriger Chatverlauf:\n' + JSON.stringify(contents) }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    const data = await geminiRes.json() as any;
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      parsedData = {
        replyGerman: responseText,
        replyPersian: 'پاسخ جمینای دریافت شد.',
        suggestedReplies: [],
        keyVocabulary: [],
      };
    }

    return new Response(JSON.stringify(parsedData), { headers: jsonHeaders });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message || 'Error processing chat',
        replyGerman: 'Entschuldigung, es gab ein technisches Problem. Lass es uns gleich noch einmal versuchen!',
        replyPersian: 'عذرخواهی می‌کنم، یک خطای موقت رخ داد. لطفاً دوباره تلاش کنید!',
      }),
      { status: 500, headers: jsonHeaders }
    );
  }
}

async function handleEvaluate(request: Request, env: Env): Promise<Response> {
  try {
    const { text, audioBase64, mimeType = 'audio/webm', targetSentence = '', level = 'B1' } = await request.json() as any;
    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is missing' }), { status: 500, headers: jsonHeaders });
    }

    const parts: any[] = [];
    if (audioBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'audio/webm',
          data: audioBase64,
        },
      });
    }

    const evaluationPrompt = `
Du bist ein renommierter Goethe-Institut / telc Prüfer und Phonetik-Experte für Deutsch als Fremdsprache.
Analysiere die deutsche Sprachleistung des persischsprachigen Lernenden genauestens.
${targetSentence ? `Der Lerner sollte folgenden Zielsatz nachsprechen: "${targetSentence}"` : ''}
${text ? `Der eingereichte Text lautet: "${text}"` : ''}
Ziel-Sprachniveau: ${level}

Bewerte präzise und konstruktiv:
1. Transkribiere die gesprochene Aufnahme exakt ("transcription").
2. Vergib 4 Teilwertungen von 0 bis 100: pronunciation, grammar, vocabulary, fluency.
3. Berechne den Gesamtwert "overallScore" (0-100).
4. Bestimme das GER-Niveau ("levelAssessment": "A1"|"A2"|"B1"|"B2"|"C1").
5. Hebe 2-3 Stärken auf Persisch hervor ("strengths").
6. Zeige konkrete Fehler auf, korrigiere sie und gib eine persische Erklärung ("improvements").
7. Gib die muttersprachliche Formulierung an ("nativeAlternative") mit Übersetzung ("nativeAlternativeFa").
8. Gib 2-3 praktische Phonetik-Tipps auf Persisch ("pronunciationTips").
9. Stelle eine Anschlussfrage auf Deutsch mit Übersetzung ("followUpQuestion").

Antworte AUSSCHLIESSLICH als JSON:
{
  "transcription": "genauer Wortlaut",
  "overallScore": 88,
  "scores": { "pronunciation": 85, "grammar": 90, "vocabulary": 88, "fluency": 86 },
  "levelAssessment": "${level}",
  "strengths": ["تلفظ رسا و واضح"],
  "improvements": [{ "issue": "خطا", "correction": "تصحیح", "explanationFa": "توضیح" }],
  "nativeAlternative": "...",
  "nativeAlternativeFa": "...",
  "pronunciationTips": ["..."],
  "followUpQuestion": { "german": "...", "persian": "..." }
}
`;
    parts.push({ text: evaluationPrompt });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    const data = await geminiRes.json() as any;
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      parsedData = {
        transcription: text || '',
        overallScore: 80,
        scores: { pronunciation: 80, grammar: 80, vocabulary: 80, fluency: 80 },
        levelAssessment: level,
        strengths: ['تلاش بسیار عالی در مکالمه آلمانی'],
        improvements: [],
        nativeAlternative: text || '',
        nativeAlternativeFa: '',
        pronunciationTips: [],
        followUpQuestion: { german: 'Wie geht es dir heute?', persian: 'امروز چطوری؟' },
      };
    }

    return new Response(JSON.stringify(parsedData), { headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: jsonHeaders });
  }
}

async function handleTTS(request: Request, env: Env): Promise<Response> {
  try {
    const { text, voiceName = 'Kore' } = await request.json() as any;
    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is missing' }), { status: 500, headers: jsonHeaders });
    }

    const cleanText = (text || '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: cleanText }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
            },
          },
        },
      }),
    });

    const data = await geminiRes.json() as any;
    const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return new Response(JSON.stringify({ error: 'No audio returned', fallbackToBrowser: true }), {
        status: 500,
        headers: jsonHeaders,
      });
    }

    return new Response(
      JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/wav' }),
      { headers: jsonHeaders }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message, fallbackToBrowser: true }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
}

async function handleTranscribe(request: Request, env: Env): Promise<Response> {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = await request.json() as any;
    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is missing' }), { status: 500, headers: jsonHeaders });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inlineData: { mimeType, data: audioBase64 } },
              { text: 'Transcribe this German speech accurately. Return ONLY the transcribed German text.' },
            ],
          },
        ],
      }),
    });

    const data = await geminiRes.json() as any;
    const text = (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();

    return new Response(JSON.stringify({ text }), { headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: jsonHeaders });
  }
}
