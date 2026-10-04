import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper to generate content with fallback
const generateWithFallback = async (ai: GoogleGenAI, config: any) => {
  try {
    return await ai.models.generateContent({
      ...config,
      model: 'gemini-3.1-flash-lite',
    });
  } catch (err: any) {
    console.warn('gemini-3.1-flash-lite error, attempting fallback to gemini-3.8-flash:', err?.message);
    return await ai.models.generateContent({
      ...config,
      model: 'gemini-3.8-flash',
    });
  }
};

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: Gemini German Chat
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages = [], scenario = 'alltag', level = 'B1', voiceMode = false } = req.body;
    const ai = getAIClient();

    const scenarioPrompts: Record<string, string> = {
      alltag: 'Alltägliches Gespräch über Hobbys, Tagesablauf, Interessen und Pläne.',
      cafe: 'Rollenspiel in einem gemütlichen Berliner Café oder Restaurant (Bestellen, Wünsche, Bezahlung).',
      job: 'Professionelles Vorstellungsgespräch für eine Stelle in Deutschland (Erfahrungen, Stärken, Fragen des Personalers).',
      arzt: 'Arztbesuch: Symptome beschreiben, Fragen des Arztes beantworten, medizinische Ratschläge verstehen.',
      wohnung: 'Wohnungsbesichtigung & Gespräch mit dem Vermieter (Miete, Kaution, Ausstattung, Regeln).',
      einkauf: 'Einkaufen im Supermarkt oder Markt (Preise, Qualität, Reklamation).',
      pruefung: 'Vorbereitung auf die Goethe / telc B1-B2 mündliche Prüfung (Präsentationen, Bildbeschreibung, Meinungsäußerung).',
    };

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

    const response = await generateWithFallback(ai, {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemInstruction + '\n\nBisheriger Chatverlauf:\n' + JSON.stringify(contents) }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
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

    res.json(parsedData);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error.message || 'Error processing chat message',
      replyGerman: 'Entschuldigung, es gab ein technisches Problem. Lass es uns gleich noch einmal versuchen!',
      replyPersian: 'عذرخواهی می‌کنم، یک خطای موقت پیش آمد. لطفاً دوباره تلاش کنید!',
    });
  }
});

// Endpoint: Gemini German Speaking Evaluation & Scoring
app.post('/api/gemini/evaluate', async (req, res) => {
  try {
    const { text, audioBase64, mimeType = 'audio/webm', targetSentence = '', level = 'B1' } = req.body;
    const ai = getAIClient();

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
2. Vergib 4 Teilwertungen von 0 bis 100:
   - "pronunciation": Genauigkeit der Aussprache (Umlaute ä/ö/ü, ch-Laut [ç vs x], r-Laut, Wortakzent).
   - "grammar": Grammatik & Satzbau (Verbposition, Kasus Dativ/Akkusativ, Endungen).
   - "vocabulary": Wortschatz & Passgenauigkeit der Ausdrücke.
   - "fluency": Sprachfluss & Rhythmus.
3. Berechne den Gesamtwert "overallScore" (0-100).
4. Bestimme das erreichte GER-Niveau ("levelAssessment": "A1"|"A2"|"B1"|"B2"|"C1").
5. Hebe 2-3 Stärken auf Persisch hervor ("strengths").
6. Zeige konkrete Fehler auf, korrigiere sie und gib eine einleuchtende persische Erklärung ("improvements").
7. Gib an, wie ein deutscher Muttersprachler den Gedanken natürlicher formulieren würde ("nativeAlternative") mit persischer Übersetzung ("nativeAlternativeFa").
8. Gib 2-3 praktische Phonetik-Tipps auf Persisch für deutschsprachige Laute ("pronunciationTips").
9. Stelle eine thematisch passende Anschlussfrage auf Deutsch mit persischer Übersetzung ("followUpQuestion").

Antworte AUSSCHLIESSLICH im folgenden JSON-Format ohne Code-Blöcke:
{
  "transcription": "genauer Wortlaut auf Deutsch",
  "overallScore": 88,
  "scores": {
    "pronunciation": 85,
    "grammar": 90,
    "vocabulary": 88,
    "fluency": 86
  },
  "levelAssessment": "B1+",
  "strengths": [
    "تلفظ واضح صامت‌ها و سرعت مناسب کلام",
    "استفاده به جا از افعال جداشدنی"
  ],
  "improvements": [
    {
      "issue": "Wortstellung im Nebensatz",
      "correction": "..., weil ich heute keine Zeit habe.",
      "explanationFa": "در جملات پیرو با weil، فعل صرف‌شده باید در آخرین جایگاه جمله قرار گیرد."
    }
  ],
  "nativeAlternative": "Natürliche muttersprachliche Variante",
  "nativeAlternativeFa": "ترجمه فارسی عبارت طبیعی‌تر",
  "pronunciationTips": [
    "برای تلفظ حرف ü دهان را گرد مانند u کنید اما سعی کنید صدای i ایجاد کنید."
  ],
  "followUpQuestion": {
    "german": "Wie verbringst du normalerweise dein Wochenende?",
    "persian": "معمولاً آخر هفته‌ات را چطور سپری می‌کنی؟"
  }
}
`;

    parts.push({ text: evaluationPrompt });

    const response = await generateWithFallback(ai, {
      contents: [{ role: 'user', parts }],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
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
        pronunciationTips: ['به تکرار مستمر کلمات کلیدی ادامه دهید.'],
        followUpQuestion: { german: 'Kannst du mir mehr darüber erzählen?', persian: 'می‌توانی بیشتر درباره‌اش به من بگویی؟' },
      };
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error('Evaluation error:', error);
    res.status(500).json({
      error: error.message || 'Error evaluating speech',
      transcription: req.body.text || '',
      overallScore: 75,
      scores: { pronunciation: 75, grammar: 75, vocabulary: 75, fluency: 75 },
      levelAssessment: 'B1',
      strengths: ['پیام شما با موفقیت منتقل شد.'],
      improvements: [],
      nativeAlternative: req.body.text || '',
      nativeAlternativeFa: '',
      pronunciationTips: [],
      followUpQuestion: { german: 'Wie geht es dir heute?', persian: 'امروز چطوری؟' },
    });
  }
});

// Endpoint: Gemini TTS Speech Generation
app.post('/api/gemini/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const ai = getAIClient();

    // Clean text of emojis or markdown brackets
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Clear, natural, articulate and friendly German language teacher',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName || 'Kore',
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error('No audio data received from Gemini TTS');
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({
      error: error.message || 'TTS generation failed',
      fallbackToBrowser: true,
    });
  }
});

// Endpoint: Transcribe Audio
app.post('/api/gemini/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required' });
    }

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: audioBase64,
            },
          },
          {
            text: 'Transcribe this German speech accurately. Return ONLY the transcribed text in German without additional commentary.',
          },
        ],
      },
    });

    res.json({
      text: (response.text || '').trim(),
    });
  } catch (error: any) {
    console.error('Transcribe error:', error);
    res.status(500).json({
      error: error.message || 'Transcription failed',
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
