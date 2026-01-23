# AI Context & Engineering Standards

## Technology Stack
*   **Frontend**: React (Vite), TailwindCSS, Lucide Icons.
*   **Backend/Compute**: Google Cloud Run (Dockerized Node.js).
*   **Database/Storage**: Google Drive (User Projects), Firebase (Auth/Hosting - optional).
*   **Video Framework**: **Remotion** (Server-Side Rendering).
*   **Browser/Scraping**: **Apify** (or generic Puppeteer via Cloud Run if simple).
*   **AI Models**: Google Gemini Pro (Reasoning/Scripting).
*   **External APIs**: ElevenLabs (TTS), HeyGen (Avatar), Postiz (Social).

## Core Data Structure: The Script
The entire application state revolves around this JSON structure. Strict adherence is required.

```typescript
type Script = {
  id: string;
  topic: string;
  // Forced 9:16 aspect ratio in pipeline
  aspectRatio: "9:16"; 
  scenes: Scene[];
}

type Scene = {
  id: string;
  segments: Segment[];
}

type Segment = {
  id: string;
  // The spoken line by the avatar/voiceover
  avatarLine: string; 
  // Context for the visual if no proof exists
  backgroundPrompts?: string; 
  
  // The core visual evidence
  proofAsset: {
    type: "web_screenshot" | "video_clip" | "ai_generated_video" | "template";
    url?: string; // The URL of the article/video
    screenshotUrl?: string; // The captured full-page screenshot
    cropCoordinates?: { x: number, y: number, width: number, height: number }; // User-selected area
    highlightText?: string; // Text to verify/highlight
    templateId?: string; // If using a pre-made template
  };

  avatarConfig: {
    isVisible: boolean;
    position: "bottom-right" | "bottom-left" | "hidden" | "full-screen";
    captionStyle?: "karaoke" | "minimal" | "standard";
  };
}
```

## Architectural Rules
1.  **Server-Side Rendering for Video**: Do NOT attempt to render high-quality video in the browser. Use a Cloud Run service running Remotion.
2.  **Manual "Truth"**: The user MUST be able to manually override the "highlight" area on a screenshot. The AI suggests, but the User confirms.
3.  **Google Stack**: Prioritize Google Cloud services (Cloud Run, Vertex AI) where generic "server" logic is needed.
4.  **Local-First / Drive Sync**: Continue using the existing pattern of saving project JSONs to Google Drive.

## Design System
*   **Dark Mode Default**: The app is a "Studio" tool. Dark backgrounds, neon accents (indigo/violet).
*   **Mobile-First Output**: All preview windows should default to 9:16 aspect ratio.
