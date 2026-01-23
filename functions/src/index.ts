
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/googleai";
// @ts-ignore
import express from "express";
// @ts-ignore
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

// Initialize Genkit with explicit API key if needed, though env var usually works.
const ai = genkit({
    plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })],
    model: "googleai/gemini-2.0-flash",
});

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Define a Search Tool (Mini-Agent)
const searchWeb = ai.defineTool(
    {
        name: "searchWeb",
        description: "Searches the web for information about a given topic.",
        inputSchema: z.object({ query: z.string() }),
        outputSchema: z.object({ results: z.array(z.string()) }),
    },
    async ({ query }) => {
        console.log(`Creating mock search results for: ${query}`);
        // Simulated latency to make the trace look interesting
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            results: [
                `Result 1 for ${query}: The latest data suggests a 400% increase in adoption.`,
                `Result 2 for ${query}: Key players include Google, OpenAI, and Anthropic.`,
                `Result 3 for ${query}: Efficiency gains are estimated at 30-50% for this sector.`
            ]
        };
    }
);

// Main Research Flow
export const researchFlow = ai.defineFlow(
    {
        name: "researchFlow",
        inputSchema: z.object({
            topic: z.string(),
        }),
        outputSchema: z.object({
            script: z.any(),
            logs: z.array(z.string()),
        }),
    },
    async (input) => {
        const logs: string[] = [];
        logs.push(`🔍 Starting research on: "${input.topic}"`);

        // The Agentic Step: capability to call tools
        const result = await ai.generate({
            prompt: `
        You are an Investigative Researcher.
        First, use the 'searchWeb' tool to find specific data points and facts about the topic: "${input.topic}".
        Then, using the search results, generate a documentary-style video script.
        
        Script Constraints:
        - JSON Format
        - Include 'Scenes' array
        - Include 'Segments' array with 'proofAsset' 
        - For 'proofAsset', use 'web_screenshot' type.
        
        IMPORTANT: Return ONLY the raw JSON object. Do not wrap in markdown or code blocks.
      `,
            tools: [searchWeb],
            config: {
                temperature: 0.5,
            },
        });

        const outputText = result.text;
        logs.push("✅ Research completed.");

        let scriptData = {};
        try {
            const cleanJson = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
            scriptData = JSON.parse(cleanJson);
        } catch (e: any) {
            logs.push(`⚠️ JSON Parse Warning: ${e.message}`);
            scriptData = { raw: outputText };
        }

        return {
            script: scriptData,
            logs: logs,
        };
    }
);

// Express Route Wrapper
app.post("/research", async (req: any, res: any) => {
    try {
        const result = await researchFlow(req.body);
        res.json(result);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Genkit Server running on port ${PORT}`);
});
