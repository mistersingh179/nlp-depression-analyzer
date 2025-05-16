import fs from "fs";
import path from "path";
import * as readline from "node:readline";
import { OpenAI } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions/completions";

async function main() {
  const TEST_PATH = "./data/primate_test.jsonl";
  const RESULTS_PATH = "./data/primate_test_results.json";

  if (!fs.existsSync(TEST_PATH)) {
    console.error(`Test file not found at ${TEST_PATH}`);
    process.exit(1);
  }
  const rl = readline.createInterface({
    input: fs.createReadStream(TEST_PATH, "utf8"),
    crlfDelay: Infinity,
  });

  // initialize OpenAI client (uses OPENAI_API_KEY env)
  const client = new OpenAI();

  let total = 0;
  let correctCount = 0;
  // symptom-level counts
  let totalTP = 0;
  let totalFP = 0;
  let totalFN = 0;
  const details: any[] = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    total++;
    let record: { messages: ChatCompletionMessageParam[] };
    try {
      record = JSON.parse(line);
    } catch {
      console.warn(`Skipping invalid JSON on line ${total}`);
      continue;
    }
    const { messages } = record;
    const history = messages.filter(
      (m) => m.role !== "assistant"
    ) as ChatCompletionMessageParam[];
    const expectedMsg = messages.find((m) => m.role === "assistant");
    if (!expectedMsg) {
      console.warn(`No expected assistant message in example ${total}`);
      continue;
    }
    // parse expected JSON from assistant message
    let expected;
    const rawExpected = expectedMsg.content;
    const expectedStr = typeof rawExpected === "string" ? rawExpected : "";
    try {
      expected = JSON.parse(expectedStr);
    } catch {
      expected = { symptoms_present: [], symptoms_absent: [] };
    }

    // call fine-tuned chat-completion
    // call fine-tuned chat completion
    const resp = await client.chat.completions.create({
      model: "ft:gpt-4.1-nano-2025-04-14:brandweaver-ai:sa-testing:BXthye9X",
      messages: history,
    });
    // content may be string or other types, ensure we have a string
    const contentRaw = resp.choices?.[0]?.message?.content;
    const reply = typeof contentRaw === "string" ? contentRaw : "";
    let predicted;
    try {
      predicted = JSON.parse(reply);
    } catch {
      predicted = { symptoms_present: [], symptoms_absent: [] };
    }

    // treat as correct if model predicts at least one true symptom
    const expectedSet = new Set<string>(expected.symptoms_present || []);
    const predictedPres = Array.isArray(predicted.symptoms_present)
      ? (predicted.symptoms_present as string[])
      : [];
    // find how many expected symptoms were found
    const intersection = predictedPres.filter(x => expectedSet.has(x));
    const tp_i = intersection.length;
    const fp_i = predictedPres.length - tp_i;
    const fn_i = (expected.symptoms_present || []).length - tp_i;
    totalTP += tp_i;
    totalFP += fp_i;
    totalFN += fn_i;
    const correct = tp_i > 0;
    if (correct) correctCount++;
    details.push({
      index: total,
      expectedPresent: expected.symptoms_present || [],
      predictedPresent: predictedPres,
      intersection,
      tp: tp_i,
      fp: fp_i,
      fn: fn_i,
      correct,
    });

    if (total === 20) {
      break;
    }
  }

  // overall example-level accuracy
  const accuracy = total > 0 ? correctCount / total : 0;
  // symptom-level precision, recall, F1
  const precision = totalTP === 0 && totalFP === 0 ? 1 : totalTP / (totalTP + totalFP);
  const recall = totalTP === 0 && totalFN === 0 ? 1 : totalTP / (totalTP + totalFN);
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const summary = { total, correctCount, accuracy, totalTP, totalFP, totalFN, precision, recall, f1 };
  console.log("Summary:", summary);
  fs.writeFileSync(RESULTS_PATH, JSON.stringify({ summary, details }, null, 2));
  console.log(`Saved detailed results to ${RESULTS_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
