import { Script, Scene, Segment } from '../types/evidence';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI } from "@google/genai";

interface ResearchResult {
    script: Script;
    logs: string[];
}

export class ResearchService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * The core agent loop:
     * 1. Decompose topic into search queries
     * 2. (Mock) Search web for sources
     * 3. Synthesize sources into a Script
     */
    async researchAndGenerateScript(topic: string): Promise<ResearchResult> {
        const logs: string[] = [];
        logs.push(`🔍 Starting research on: "${topic}"`);

        // Initialize Gemini with the provided key (New SDK) - process moved inside try/catch

        logs.push(`🧠 Synthesizing narrative with Google Search Grounding...`);

        const systemInstruction = `
        You are an advanced Investigative Journalist AI.
        Generate a JSON object representing a documentary-style video script about the provided Topic.
        The output must strictly follow the Script schema provided in the prompt.
        
        CRITICAL: 
        1. Use Google Search to find REAL facts and URLs.
        2. Assign "web_screenshot" proofAsset types with valid URLs.
        3. Create 4-6 scenes.
        `;

        const userPrompt = `
        Topic: "${topic}"

        Schema Definition (TypeScript):
        interface Script {
          id: string; // use a random UUID
          topic: string; // "${topic}"
          aspectRatio: "9:16";
          scenes: Scene[];
        }
        interface Scene {
            id: string; // uuid
            order: number; // 0, 1, 2...
            segments: Segment[];
        }
        interface Segment {
            id: string; // uuid
            order: number;
            avatarLine: string; // The spoken narration. Keep it punchy, like Johnny Harris or Vox.
            backgroundPrompt?: string; 
            avatarConfig: {
                isVisible: boolean; 
                position: "bottom-right" | "bottom-left" | "hidden" | "full-screen";
            };
            proofAsset: {
                type: "web_screenshot" | "video_clip" | "ai_generated_video" | "template";
                url?: string; // MANDATORY for web_screenshot with REAL URL.
                sourceTitle?: string; 
                highlightText?: string; 
            };
        }

        Find diverse sources. Return ONLY valid JSON.
        `;

        try {
            // Initialize Gemini with the provided key (New SDK)
            const ai = new GoogleGenAI({ apiKey: this.apiKey });

            // New SDK usage
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                config: {
                    tools: [{ googleSearch: {} }],
                    responseMimeType: 'application/json'
                },
                contents: [
                    { role: 'user', parts: [{ text: systemInstruction + "\n" + userPrompt }] }
                ]
            });

            // Handle response
            const promptResponse = response.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!promptResponse) {
                throw new Error("No text returned from Gemini.");
            }

            // Cleanup
            const cleanJson = promptResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const generatedScript = JSON.parse(cleanJson);

            // Enrich
            generatedScript.id = generatedScript.id || uuidv4();
            generatedScript.createdAt = new Date().toISOString();

            logs.push(`✅ Script generated with ${generatedScript.scenes?.length || 0} scenes.`);
            return { script: generatedScript as Script, logs };

        } catch (error) {
            console.error("Research Agent failed:", error);
            logs.push(`❌ Error: ${error}`);
            // Fallback for demo if API fails
            return { script: this.generateMockScript(topic), logs: [...logs, "⚠️ Used fallback script due to error."] };
        }
    }

    private generateMockScript(topic: string): Script {
        return {
            id: uuidv4(),
            topic: topic,
            aspectRatio: "9:16",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            scenes: [
                {
                    id: uuidv4(),
                    order: 0,
                    segments: [
                        {
                            id: uuidv4(),
                            order: 0,
                            avatarLine: `This isn't sci-fi, this is ${topic}, and the data is shocking.`,
                            avatarConfig: { isVisible: true, position: "full-screen" },
                            proofAsset: {
                                type: "ai_generated_video",
                            }
                        },
                        {
                            id: uuidv4(),
                            order: 1,
                            avatarLine: "Look at this report from Reuters. The numbers are up 400% in a single week.",
                            avatarConfig: { isVisible: true, position: "bottom-right" },
                            proofAsset: {
                                type: "web_screenshot",
                                url: "https://www.reuters.com/technology",
                                sourceTitle: "Reuters Technology",
                                highlightText: "The numbers are up 400%"
                            }
                        }
                    ]
                }
            ]
        };
    }
}
