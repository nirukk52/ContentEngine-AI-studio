# Genkit Rapid Prototyping Workflow

I have set up a **Genkit** environment in the `functions/` directory to meet your request for "tracing mini-agents" and "rapid prototyping".

## Rationale
[Genkit](https://firebase.google.com/docs/genkit) is the best fit for your requirements because:
1.  **Dev UI**: It launches a local server (`http://localhost:4000`) that analyzes every LLM call.
2.  **Traceability**: You can see exactly which "Tools" (mini-agents) were called, their inputs, and their outputs in a visual timeline.
3.  **Hot Reloading**: The setup uses `--watch`, so you can edit your prompt or tool logic in `index.ts`, save, and immediately re-run the flow in the UI.

## How to Run

1.  **Start the Genkit Server**:
    The server is already running in the background. If you need to restart it:
    ```bash
    cd functions
    npm run genkit:start
    ```

2.  **Open the Developer UI**:
    Go to [http://localhost:4000](http://localhost:4000) in your browser.

3.  **Run a Flow**:
    - Click on **Flows** -> `researchFlow`.
    - Enter `{"topic": "Artificial Intelligence"}` in the JSON input.
    - Click **Run**.

4.  **Inspect Traces**:
    - After the run, click the **Inspect** button (plain eye icon) or view the **Trace History**.
    - You will see a step-by-step breakdown:
        - `generate` (The LLM deciding what to do)
        - `tool: searchWeb` (Your mini-agent executing) 
        - `generate` (The LLM using the tool output to write the script)

## The Code Structure (`functions/src/index.ts`)

-   **`searchWeb` Tool**: This is your "Mini Agent". It simulates searching the web. You can swap the mock logic for real API calls (e.g., Tavily, Google Search) later.
-   **`researchFlow`**: The orchestration layer. It prompts the LLM and gives it access to the tools.

## Troubleshooting

If you see `404 Not Found` errors regarding the model, it indicates the API Key might lack access to that specific model version.
**Fix**: I have configured it to use `gemini-2.0-flash` which is working with your key. If you need to change it, check `functions/src/index.ts`.
