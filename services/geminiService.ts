import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ScriptSegment } from "../types";

// Helper to get client with current key
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

// --- Copywriter Agent ---

export const generateScript = async (
  topic: string, 
  systemInstruction: string,
  ragContext: string = ""
): Promise<ScriptSegment[]> => {
  const ai = getAiClient();
  
  const fullSystemInstruction = `${systemInstruction}
  
  PAST LEARNINGS & PREFERENCES (RAG):
  ${ragContext}
  
  Apply these learnings to the new script generation. Break response into JSON only.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Create a viral 30-40 second short video script about: "${topic}". 
    Break it down into segments of approximately 4-6 seconds each. 
    Total duration must be 30-40 seconds.`,
    config: {
      systemInstruction: fullSystemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            duration: { type: Type.NUMBER, description: "Duration in seconds (4-6s)" },
            scriptText: { type: Type.STRING, description: "The spoken voiceover text" },
            visualPrompt: { type: Type.STRING, description: "Detailed prompt for an image/video generator describing the scene" },
            visualType: { type: Type.STRING, enum: ["video", "image"], description: "Recommended visual type" }
          },
          required: ["duration", "scriptText", "visualPrompt", "visualType"]
        }
      }
    }
  });

  const text = response.text || "[]";
  const rawSegments = JSON.parse(text);
  
  return rawSegments.map((seg: any, index: number) => ({
    id: `seg-${Date.now()}-${index}`,
    order: index,
    duration: seg.duration,
    scriptText: seg.scriptText,
    visualPrompt: seg.visualPrompt,
    visualType: seg.visualType || 'image',
  }));
};

// --- Chat & Refinement ---

export const chatWithAgent = async (
  history: {role: 'user'|'model', text: string}[], 
  message: string,
  systemInstruction: string
): Promise<string> => {
  const ai = getAiClient();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction },
    history: history.map(h => ({ role: h.role === 'model' ? 'model' : 'user', parts: [{ text: h.text }] }))
  });

  const response = await chat.sendMessage({ message });
  return response.text || "";
};

// --- Visual Artist Agent (Image/Avatar) ---

export const generateSegmentImage = async (prompt: string, isAvatar = false): Promise<string> => {
  const ai = getAiClient();
  
  const finalPrompt = isAvatar 
    ? `Influencer avatar character portrait, high resolution, consistent lighting. ${prompt}`
    : prompt;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: finalPrompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "9:16",
        imageSize: "1K"
      }
    }
  });

  const candidate = response.candidates?.[0];
  if (candidate) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  throw new Error("No image generated");
};

// --- Visual Artist Agent (Video - Veo) ---

export const generateSegmentVideo = async (prompt: string, imageBase64?: string): Promise<string> => {
  const ai = getAiClient();

  const config: any = {
    numberOfVideos: 1,
    resolution: '720p',
    aspectRatio: '9:16'
  };

  let params: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config
  };

  if (imageBase64) {
    const data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const mimeType = imageBase64.includes(';') ? imageBase64.split(';')[0].split(':')[1] : 'image/png';
    params.image = {
        imageBytes: data,
        mimeType: mimeType
    };
  }

  let operation = await ai.models.generateVideos(params);

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Video generation failed");

  const fetchRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  const blob = await fetchRes.blob();
  return URL.createObjectURL(blob);
};

// --- Voice Actor Agent (TTS) ---

export const generateSegmentAudio = async (text: string): Promise<string> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");
  
  return base64Audio; 
};