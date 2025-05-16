import fs from 'fs';
import path from 'path';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions/completions';

// Paths
const INPUT_PATH = path.resolve(process.cwd(), 'data', 'primate_dataset.json');
const OUTPUT_DIR = path.resolve(process.cwd(), 'data');
const OUTPUT_PATH = path.resolve(OUTPUT_DIR, 'primate_dataset.jsonl'); // chat-format JSONL for fine-tuning

// Check input exists
if (!fs.existsSync(INPUT_PATH)) {
  console.error(`Error: input file not found at ${INPUT_PATH}`);
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Load and parse dataset
const raw = fs.readFileSync(INPUT_PATH, 'utf-8');
let records: Record<string, any>[];
try {
  records = JSON.parse(raw);
} catch (err) {
  console.error(`Error parsing JSON from ${INPUT_PATH}:`, err);
  process.exit(1);
}

// records = records.slice(0, 2);

// Transform records into chat-format JSONL entries
interface ChatExample {
  messages: ChatCompletionMessageParam[];
}
const examples: ChatExample[] = records.map((record) => {
  const postText = record.post_text || record.text || '';
  // Extract present and absent symptoms from annotations array
  const present: string[] = [];
  const absent: string[] = [];
  if (Array.isArray(record.annotations)) {
    for (const [symptom, annotation] of record.annotations) {
      const lower = String(annotation).toLowerCase();
      if (lower === 'yes') present.push(symptom);
      else if (lower === 'no') absent.push(symptom);
    }
  }
  // Build chat messages for fine-tuning
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'You extract symptoms from the user input and reply ONLY in JSON with keys symptoms_present and symptoms_absent.'
    },
    { role: 'user', content: postText },
    { role: 'assistant', content: JSON.stringify({ symptoms_present: present, symptoms_absent: absent }) },
  ];
  return { messages };
});

// Write to JSONL
const outStream = fs.createWriteStream(OUTPUT_PATH, { encoding: 'utf-8' });
for (const ex of examples) {
  outStream.write(JSON.stringify(ex) + '\n');
}
outStream.end(() => {
  console.log(`Wrote ${examples.length} examples to ${OUTPUT_PATH}`);
});