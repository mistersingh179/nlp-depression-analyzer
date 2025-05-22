 # How to Use

 This project provides:
 - `agent.ts`: an interactive console agent to gather user stories and extract symptoms via a fine-tuned OpenAI model.
 - `getSymptoms.ts`: a helper that invokes your symptom-extraction fine-tune.
 - `convert.ts`: prepares JSONL data for fine-tuning.
 - `check-ft-model.ts`: evaluates a fine-tuned model on a held-out test set.

 ## Prerequisites

 1. Node.js (>=16) and npm installed.
 2. An OpenAI API key. In your terminal:
    ```bash
    export OPENAI_API_KEY="sk-..."
    ```

 ## Install

 Install project dependencies:
 ```bash
 npm install
 ```

 ## Build

 Compile TypeScript sources:
 ```bash
 npm run build
 ```

 ## Run the Interactive Agent

Launch the console agent and follow the prompts:
```bash
npx tsx src/agent.ts
```

 ## Evaluate a Fine-Tuned Model

 Once you have a fine-tuned model ID, run:
 ```bash
 npm run check-ft-model -- ft-YOUR_MODEL_ID
 ```

 This prints accuracy, precision, recall, F1, and writes detailed results to `data/primate_test_results.json`.

 ---
 For data prep and fine-tuning, see `src/convert.ts` and `src/split-jsonl.ts`.