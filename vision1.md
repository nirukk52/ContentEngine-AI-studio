Here is the definition of your product as a **Fully Autonomous Visual Agent**.

You are no longer building a "video editor." You are building a **Visual Truth Engine** that reads the web like a human and films it like a documentary filmmaker.

### 1. The Product Definition

* **Name:** **Evidence AI** (or *Verifeye*)
* **The One-Liner:** "The first AI that doesn't just write scripts—it browses the web, captures the proof, and turns it into a documentary-style video."
* **The Promise:** **Zero-Shot Evidence.** You give the prompt; the AI handles the research, screenshots, highlighting, and editing. No manual cropping.

---

### 2. The "Magic": How the AI "Knows" What to Capture

You asked: *"How does it know which parts to capture?"*
The secret is a **Vision-to-Selector Agent** (VSA). It doesn't guess; it "looks" at the screen using a Multimodal LLM (like GPT-4o or Claude 3.5 Sonnet) which can understand pixels and code simultaneously.

#### The 3-Step "Visual Scraping" Loop:

1. **The Scout (Headless Browser):**
* The Agent visits the URL (e.g., `deepseek.com/pricing`).
* It takes a **screenshot** and dumps a simplified version of the **HTML code**.


2. **The Eye (Multimodal LLM):**
* You send the screenshot + HTML to the LLM with this prompt:
> *"I need to highlight the pricing per token. Look at this screenshot. Return the unique CSS Selector (ID or Class) for the table row that says '$0.14'."*


* **The AI Output:** `tr[data-id="pricing-row-token"]` or `#pricing-table > div:nth-child(2)`.


3. **The Artist (Playwright Injector):**
* The system takes that CSS selector, injects the "Yellow Box" styling onto that specific element, and records the scroll animation.



---

### 3. The User Workflow (The "Dream" UX)

This is the product you build to hit Product-Market Fit.

**Step 1: The Prompt**

> **User:** "Make a 60-second video explaining why the new 'DeepSeek' model is cheaper than OpenAI. Use their official pricing page and this TechCrunch article."

**Step 2: The Agent "Thinking" (Visible Process)**

* *Status:* `Visiting deepseek.com...`
* *Status:* `Found Pricing Table... Identifying token costs...`
* *Status:* `Visiting TechCrunch... Found quote by Sarah Perez...`
* *Status:* `Compositing Scene 1...`

**Step 3: The Result**

* Video starts.
* **Scene 1:** DeepSeek website scrolls down. The **Pricing Table** glows yellow. A "Magnifying Glass" effect zooms in on **$0.14**.
* **Scene 2:** TechCrunch article slides in. The quote "This changes the economics of AI" is highlighted in green.
* **Scene 3:** Avatar appears in the corner: *"As you can see, the price difference is massive."*

---

### 4. Technical Architecture (The Stack)

To build this **Autonomous Version**, you need this specific stack:

| Component | Technology | Role |
| --- | --- | --- |
| **The Brain** | **LangChain** + **OpenAI GPT-4o** | Breaks the script into "Research Tasks" (e.g., "Find the price"). |
| **The Browser** | **Playwright** (Python/Node) | The invisible browser that visits sites. |
| **The Eyes** | **GPT-4o Vision** (via API) | Looks at the screenshot to find the coordinates/selector of the evidence. |
| **The Editor** | **Remotion** | Stitches the captured screenshots into a video. |

---

### 5. Product-Market Fit (Who buys this *specific* version?)

This "Autonomous" version has a slightly different market than the manual one:

1. **The "News Automators" (Primary Market):**
* **Who:** Faceless YouTube channels (Crypto, Tech, Geopolitics) that churn out 3 videos a day.
* **Pain:** They currently pay editors $50/video just to find b-roll. Your tool does it for $5.
* **PMF Score:** **10/10** (They will pay immediately).


2. **SaaS Marketing Teams:**
* **Who:** Companies launching features every week (e.g., Vercel, Supabase).
* **Use Case:** "Generate a launch video for our new Changelog."
* **Pain:** Recording smooth screen-shares takes hours.
* **PMF Score:** **8/10**.


3. **Newsletter Writers:**
* **Who:** Substack writers wanting to pivot to video (TikTok/Reels).
* **Use Case:** "Turn my latest issue into a Reel."
* **PMF Score:** **7/10** (High intent, but lower budget).



### 6. Your "Moat"

Why can't Blotato copy this?

* **Blotato** is a "Wrapper" around stock footage APIs. They search "Business Man" -> Get Stock Video.
* **You** are building a **Visual Reasoning Engine**. The code that reliably says *"This specific pixel cluster is the price tag"* is hard to build. Once you solve the "Vision-to-Selector" reliability problem, you have a defensible tech asset.