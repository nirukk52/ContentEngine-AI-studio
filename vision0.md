Here is the clear product definition for your **Dynamic High-Trust Explainer Engine**.

### **Product Name (Internal):** Evidence-First Video Engine (EFVE)

**Category:** Automated Visual Journalism Platform
**Core Promise:** "Turn a prompt into a high-trust, documentary-style video—where every claim is backed by visual proof, not stock footage."

---

### 1. The Core Product Workflow

The product operates in a 4-step linear pipeline.

#### **Step 1: The Research Agent (The Brain)**

* **Input:** User Prompt (e.g., *"Analyze why DeepSeek's V3 model crashed Nvidia's stock today."*)
* **Action:** The system doesn't just write a script; it builds a **Fact Graph**.
* It scrapes *Bloomberg* for the stock chart.
* It visits *DeepSeek’s website* to find the "API Cost" section.
* It finds a *relevant tweet* from an industry expert.


* **Output:** A structured JSON object dividing the narrative into **4–8 distinct scenes**, pairing each sentence with a specific *visual asset request* (e.g., `Asset: DOM_Screenshot`, `Source: deepseek.com`, `Action: Highlight_Price`).

#### **Step 2: The "Director Mode" UI (The Control)**

* **The Interface:** A clean, linear timeline showing the 4–8 scenes.
* **User Control per Scene:**
* **Visual Selection:** User sees the AI's proposed "Evidence" (e.g., the Screenshot). They can swap it for:
* A different screenshot (re-scrape).
* A Full AI-Generated Video (if no evidence exists).
* A Motion Graphic Template (e.g., a "VS" battle card).


* **Avatar Toggle (The Dynamic Switch):**
* **On:** Avatar narrates in the corner (Picture-in-Picture).
* **Full:** Avatar takes full screen (for emotional/opinionated segments).
* **Off:** Avatar disappears; voiceover continues over full-screen evidence (high immersion).





#### **Step 3: The Asset Generator (The Factory)**

* **This is your Moat.** The system executes the visual requests programmatically:
* **The Scraper:** Launches a headless browser to take a 4K screenshot of the specific website section (DOM element) and records a "smooth scroll" video.
* **The Highlighter:** Automatically overlays a "yellow marker" animation on the text mentioned in the script.
* **The Chart Engine:** Pulls raw data and renders a clean, branded line chart (SVG animation).



#### **Step 4: The Render (The Polish)**

* Combines the **Dynamic Avatar** (HeyGen API) + **Programmatic Visuals** (Remotion) + **Background Music** into a final 1080p video (9:16 or 16:9).

---

### 2. The "Dynamic" Logic (The Secret Sauce)

This is the feature that prevents the video from feeling "robotic." The engine automatically assigns layout states based on the *content type*:

| Content Type | Narrative Goal | **Dynamic Layout State** |
| --- | --- | --- |
| **Opinion / Intro** | Connection | **Full Screen Avatar** (Face-to-Camera) |
| **Hard Data / Chart** | Credibility | **Avatar OFF** + Full Screen Chart (Voiceover only) |
| **Web Evidence** | Context | **PiP Avatar** (Corner) + Scrolling Website Background |
| **Complex Quote** | Clarity | **Avatar OFF** + Kinetic Typography (Text animation) |

* **Why this wins:** It mimics human editing patterns. A human editor cuts away from the face when showing a chart to let the viewer focus. Your engine does this automatically.

---

### 3. Technical Specs (The "JSON Script")

The core data structure that drives the engine:

```json
{
  "Scene_2": {
    "Intent": "Evidence_Proof",
    "Audio": "Their pricing is 10x cheaper than OpenAI, sitting at just $0.14 per million tokens.",
    "Visual_Type": "Browser_Scroll_Highlight",
    "Visual_Config": {
      "URL": "https://deepseek.com/pricing",
      "Target_DOM_ID": "#pricing-table-v3",
      "Highlight_Text": "$0.14",
      "Scroll_Speed": "Medium"
    },
    "Avatar_State": "PiP_Bottom_Right",
    "Transition": "Zoom_In"
  }
}

```

---

### 4. Target User & Use Case (PMF)

**Target User:** The "Intellectual Creator" (Fintech, Tech, Geopolitics).

* *Current Pain:* "I spend 4 hours taking screenshots of articles, cropping them, and keyframing them in Premiere Pro."
* *Your Solution:* "Paste the article URL. Get the video with screenshots already animated."

**Example Use Case: "The Tech Reviewer"**

1. **Prompt:** "Review the new iPhone 17 rumors based on MacRumors and 9to5Mac articles."
2. **Scene 1 (Intro):** Full Avatar. *"The iPhone 17 is leaking, and it looks insane."*
3. **Scene 2 (The Leak):** Avatar shrinks to corner. Background shows MacRumors article. System auto-highlights the sentence about "120Hz display."
4. **Scene 3 (The Specs):** Avatar disappears. A comparison table (Template) appears showing iPhone 16 vs 17 specs.
5. **Scene 4 (Opinion):** Full Avatar returns. *"I think this kills the Android market."*

### 5. Why is this defensible? (The Moat)

Anyone can wrap HeyGen.
**Very few people can build a robust "DOM Scraper & Highlighter."**

* Building a bot that can visit *any* website, identify the "main content," and animate a highlight over specific text—without breaking—is a hard engineering problem.
* **That is your moat.** The "Evidence Engine."