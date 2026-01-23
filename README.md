# Evidence-First Video Engine (EFVE)

## Product Vision
**"Turn a prompt into a high-trust, documentary-style video—where every claim is backed by visual proof, not stock footage."**

## Create seamless Johhny Harris and Varun Maya style videos.

EFVE is an automated visual journalism platform that moves beyond generic AI video generation. Instead of hallucinating visuals, it "researches" the web, captures real evidence (news articles, charts, tweets), and allows the user to act as a "Director" to highlight the truth.

## Core Pillars
1.  **AI Research Agent**: Analyzes a prompt, searches the web, and constructs a "Fact Graph" of claims and their URLs.
2.  **Manual Director Control**: Users don't just accept AI output. They draw the "focus box" on evidence to ensure accuracy.
3.  **High-Trust Rendering**: The final output mimics high-end documentary editing (smooth scrolling, highlighting, picture-in-picture avatars).

## User Workflow (The "Director Mode")
1.  **Input**: User types a prompt (e.g., "Analyze why DeepSeek's V3 model crashed Nvidia's stock today.").
2.  **Research**: The Agent browses the web, finds key articles/data, and generates a structured script with references.
3.  **Direct**:
    *   The user reviews the script segments.
    *   For evidence segments, the user sees a screenshot of the source.
    *   **Action**: User draws a bounding box around the key sentence or chart.
    *   *Alternative*: User swaps evidence for an AI-generated filler video if no visual proof exists.
4.  **Render**: The system fuses the "scrolled evidence," avatar narration (HeyGen), and audio (ElevenLabs) into a 9:16 vertical video.

## Key Features
*   **Deep Research**: Goes beyond surface-level text generation; finds specific URLs.
*   **Screenshot Engine**: Uses Apify/ScreenshotOne to grab high-fidelity full-page screenshots.
*   **Manual Crop/Highlight Tool**: A frontend interface for users to select exactly what to show.
*   **Dynamic Avatar**: Intelligent placement (PiP, Full Screen, or Hidden) based on scene context.
*   **Cloud Rendering**: High-quality Remotion rendering on Google Cloud Run.

## Tech Stack
*   **Frontend**: React + Vite (The Director UI)
*   **Backend**: Google Cloud Run (Video Rendering)
*   **Video Engine**: Remotion
*   **AI/Research**: Google Gemini / OpenAI (Reasoning), Apify (Scraping)
*   **Voice/Avatar**: ElevenLabs (Audio), HeyGen (Avatar Video)
*   **Publishing**: Postiz Integration