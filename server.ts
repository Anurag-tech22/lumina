import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// 1. Defensively Initialize Firebase Admin for Secure Backend Verification
if (getApps().length === 0) {
  try {
    initializeApp({
      projectId: "gen-lang-client-0502457613"
    });
    console.log("Firebase Admin initialized securely.");
  } catch (error) {
    console.warn("Firebase Admin init failed. Ensure application default credentials are set.", error);
  }
}

const app = express();
const PORT = 3000;

// 2. Top-Level Request Deserialization (Ordering Guarantee)
app.use(express.json({ limit: '10mb' }));

// 3. Security: Auth Verification Middleware
const verifyAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Security Check Failed: Invalid token', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token signature' });
  }
};

// Defensive Payload Ingestion Helper
const sanitizePayload = (payload: any) => (payload && typeof payload === 'object' ? payload : {});

// Initialize Gemini SDK
let ai: GoogleGenAI;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (e) {
  console.warn("Failed to initialize GoogleGenAI. Is GEMINI_API_KEY set?");
}

// 4. Resilient Model Fallback Ladder
async function generateContentWithFallback(options: any) {
  if (!ai) throw new Error("Gemini AI client not initialized. Check API keys.");
  
  const defaultModels = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-flash-latest", "gemini-3.7-flash"];
  const models = options.model ? Array.from(new Set([options.model, ...defaultModels])) : defaultModels;
  
  let lastError;
  
  for (const model of models) {
    try {
      return await ai.models.generateContent({ ...options, model });
    } catch (error: any) {
      lastError = error;
      
      let statusStr = String(error.status || error.code || (error.response && error.response.status) || "");
      if (statusStr === "undefined" || !statusStr) {
        if (error.message && error.message.includes('"code": 400')) statusStr = "400";
        if (error.message && error.message.includes('"code": 403')) statusStr = "403";
        if (error.message && error.message.includes('"code": 404')) statusStr = "404";
        if (error.message && error.message.includes('"code": 429')) statusStr = "429";
        if (error.message && error.message.includes('"code": 503')) statusStr = "503";
      }
      
      if (!statusStr.includes("503") && !statusStr.toLowerCase().includes("unavailable") && !statusStr.includes("429")) {
        console.log(`[Fallback Triggered] Model ${model} failed. Error:`, error.message.substring(0, 200));
      }
      
      if (statusStr.includes("400") || statusStr.includes("403") || statusStr.includes("404")) {
        throw error;
      }
    }
  }
  
  throw lastError || new Error("All fallback models failed.");
}

async function* generateContentStreamWithFallback(options: any) {
  if (!ai) throw new Error("Gemini AI client not initialized. Check API keys.");
  
  const defaultModels = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-flash-latest", "gemini-3.7-flash"];
  const models = options.model ? Array.from(new Set([options.model, ...defaultModels])) : defaultModels;
  
  let lastError;
  
  for (const model of models) {
    try {
      const stream = await ai.models.generateContentStream({ ...options, model }) as any;
      const iterator = stream[Symbol.asyncIterator]();
      
      // Await the first chunk to catch immediate 503 Unavailable or 429 Resource Exhausted errors
      const firstResult = await iterator.next();
      if (!firstResult.done) {
        yield firstResult.value;
      }
      
      // If we got here without throwing, the connection is good. Stream the rest.
      while (true) {
        const result = await iterator.next();
        if (result.done) break;
        yield result.value;
      }
      return; // Exit successfully
    } catch (error: any) {
      lastError = error;
      
      let statusStr = String(error.status || error.code || (error.response && error.response.status) || "");
      if (statusStr === "undefined" || !statusStr) {
        if (error.message && error.message.includes('"code": 400')) statusStr = "400";
        if (error.message && error.message.includes('"code": 403')) statusStr = "403";
        if (error.message && error.message.includes('"code": 404')) statusStr = "404";
        if (error.message && error.message.includes('"code": 429')) statusStr = "429";
        if (error.message && error.message.includes('"code": 503')) statusStr = "503";
      }
      
      if (!statusStr.includes("503") && !statusStr.toLowerCase().includes("unavailable") && !statusStr.includes("429")) {
        console.log(`[Fallback Triggered] Model ${model} failed. Error:`, error.message.substring(0, 200));
      }
      
      if (statusStr.includes("400") || statusStr.includes("403") || statusStr.includes("404")) {
        throw error;
      }
    }
  }
  
  throw lastError || new Error("All fallback models failed.");
}

// 5. Secure Streaming API Endpoint for Chat
app.post("/api/chat", verifyAuth, async (req: any, res: any) => {
  try {
    const data = sanitizePayload(req.body);
    const messages = Array.isArray(data.messages) ? data.messages : [];
    
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const formattedMessages = messages.map((m: any) => {
      const parts: any[] = [{ text: m.text || '' }];
      if (m.images && Array.isArray(m.images)) {
        for (const img of m.images) {
          if (img.base64 && img.mimeType) {
            parts.push({
              inlineData: {
                data: img.base64,
                mimeType: img.mimeType
              }
            });
          }
        }
      }
      return {
        role: m.role === 'user' ? 'user' : 'model',
        parts
      };
    }).filter((m: any) => m.parts.length > 0 && (m.parts[0].text.trim().length > 0 || m.parts.length > 1));

    if (formattedMessages.length === 0) {
      return res.status(400).json({ error: "Message contents are required." });
    }

    const language = data.language || "auto";
    const useDeepSearch = !!data.deepSearch;
    let systemLanguageInstruction = "";
    
    if (language === "auto") {
      systemLanguageInstruction = "IMPORTANT: You MUST detect the primary language used by the user in their most recent prompt, and reply ENTIRELY in that exact same language. For example, if the user speaks Hindi, reply natively in Hindi. If Spanish, reply in Spanish.";
    } else {
      const languageMap: Record<string, string> = {
        "en-US": "English", "hi-IN": "Hindi", "es-ES": "Spanish",
        "fr-FR": "French", "de-DE": "German", "zh-CN": "Chinese",
        "ja-JP": "Japanese", "ar-SA": "Arabic", "ru-RU": "Russian"
      };
      const languageName = languageMap[language] || language;
      systemLanguageInstruction = `IMPORTANT: You MUST respond in ${languageName} (language code: ${language}). Ensure your response natively uses this language.`;
    }

        const aiOptions: any = {
      contents: formattedMessages,
      config: {
        systemInstruction: `You are a highly intelligent, genuine, and supportive personal AI guide. Your purpose is to help the user in every situation they face. Explain concepts smartly and clearly, offer practical and wise guidance, and always respond with authenticity and care. Tailor your tone to be a deeply trusted, insightful, and highly capable mentor. ${systemLanguageInstruction}`,
      }
    };

    if (useDeepSearch) {
      aiOptions.config.tools = [{ googleSearch: {} }];
      aiOptions.model = 'gemini-3.5-flash';
    }

    const responseStream = generateContentStreamWithFallback(aiOptions);

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Explicit Error Escalation
    if (!res.headersSent) {
      let cleanMessage = "An unexpected error occurred.";
      if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
        cleanMessage = "I am currently receiving too many requests. Please try again in a few seconds.";
      } else if (error.message?.includes("403")) {
        cleanMessage = "Access denied. Please check API key permissions.";
      } else {
        cleanMessage = "Failed to generate response. Please try again.";
      }
      res.status(500).json({ error: cleanMessage });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream interrupted due to an error." })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});

// 6. Deep Research Agent Endpoint
app.post("/api/research", verifyAuth, async (req: any, res: any) => {
  try {
    const data = sanitizePayload(req.body);
    const messages = Array.isArray(data.messages) ? data.messages : [];
    
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const prompt = data.prompt || "Research this topic.";
    let historyContext = "";
    if (messages.length > 0) {
      historyContext = "Conversation History:\n" + messages.map((m: any) => `${m.role.toUpperCase()}: ${m.text}`).join("\n") + "\n\n";
    }

    const fullPrompt = historyContext + "Current Request:\n" + prompt;

    if (!ai) throw new Error("Gemini AI client not initialized.");

            const stream = generateContentStreamWithFallback({
      model: 'gemini-3.5-flash',
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error("Deep Research API Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to run deep research." });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream interrupted due to an error." })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});

// 7. Omni-Cognitive Prism Endpoint
app.post("/api/prism", verifyAuth, async (req: any, res: any) => {
  try {
    const data = sanitizePayload(req.body);
    const { prompt, persona, image } = data;
    if (!prompt) return res.status(400).json({ error: "Prompt is required." });
    
    const parts: any[] = [{ text: prompt }];
    if (image && image.base64 && image.mimeType) {
        parts.push({ inlineData: { data: image.base64, mimeType: image.mimeType } });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let systemInstruction = "";
    if (persona === "visionary") {
      systemInstruction = "You are 'The Visionary'. You think exclusively in future paradigms, radical possibilities, metaphors, and high-level abstracts. Reject conventional limits and boundaries. Keep it concise, poetic, and profound.";
    } else if (persona === "analyst") {
      systemInstruction = "You are 'The Analyst'. You break down concepts into strict empirical, logical, and structural components. You care about efficiency, algorithms, and concrete metrics. Keep it concise, structured, and bullet-pointed.";
    } else if (persona === "critic") {
      systemInstruction = "You are 'The Critic'. You act as a Red Team. Your goal is to ruthlessly but constructively point out assumptions, risks, and flaws in the premise. Ask hard questions. Keep it concise and sharp.";
    } else if (persona === "synthesizer") {
      systemInstruction = "You are 'The Omni-Synthesizer'. You have just witnessed a debate between a Visionary, an Analyst, and a Critic. Your job is to extract the unified, ultimate truth that harmonizes all three perspectives into a single, profound conclusion.";
    }

    if (!ai) throw new Error("Gemini AI client not initialized.");

        const stream = generateContentStreamWithFallback({
      model: 'gemini-3.6-flash',
      contents: parts,
      config: {
        systemInstruction
      }
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error("Prism API Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to run prism." });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream interrupted." })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});

// 8. Authenticity Enhancement: Session Insight Generator Endpoint
app.post("/api/insights", verifyAuth, async (req: any, res: any) => {
  try {
    const data = sanitizePayload(req.body);
    const messages = Array.isArray(data.messages) ? data.messages : [];
    
    if (messages.length < 2) {
      return res.status(400).json({ error: "Not enough context to generate insights." });
    }

    const conversationText = messages.map((m: any) => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
    
    const prompt = `Analyze the following interactive session and extract deep insights. 
Return a raw JSON object (no markdown formatting, no code blocks) with the following structure:
{
  "mood": "A 1-3 word description of the overall mood",
  "keyThemes": ["theme 1", "theme 2", "theme 3"],
  "summary": "A concise 2-sentence summary of the emotional or logical breakthroughs",
  "actionItems": ["action 1", "action 2"]
}

Session Data:
${conversationText}`;

    const response = await generateContentWithFallback({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    }) as any;

    const jsonText = response.text || "{}";
    res.json(JSON.parse(jsonText));
  } catch (error: any) {
    console.error("Insights API Error:", error);
    let cleanMessage = "An unexpected error occurred.";
      if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
        cleanMessage = "I am currently receiving too many requests. Please try again in a few seconds.";
      } else {
        cleanMessage = "Failed to generate insights.";
      }
      res.status(500).json({ error: cleanMessage });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
