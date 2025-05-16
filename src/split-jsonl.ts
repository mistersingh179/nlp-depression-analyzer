#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { shuffle } from 'lodash';

// Paths
const INPUT_PATH = path.resolve(process.cwd(), 'data', 'primate_dataset.jsonl');
const TRAIN_PATH = path.resolve(process.cwd(), 'data', 'primate_train.jsonl');
const VAL_PATH   = path.resolve(process.cwd(), 'data', 'primate_val.jsonl');
const TEST_PATH  = path.resolve(process.cwd(), 'data', 'primate_test.jsonl');

// Load the full JSONL file
if (!fs.existsSync(INPUT_PATH)) {
  console.error(`Error: input file not found at ${INPUT_PATH}`);
  process.exit(1);
}
const raw = fs.readFileSync(INPUT_PATH, 'utf8');
const lines = raw
  .split(/\r?\n/)   // split on CRLF or LF
  .map(l => l.trim()) // remove extra whitespace
  .filter(l => l.length > 0);
console.log(`Loaded ${lines.length} records from JSONL`);

// Shuffle lines randomly
const shuffled = shuffle(lines);
const total = shuffled.length;
// Define split ratios
const trainRatio = 0.8;
const valRatio   = 0.1;
// Compute sizes
const trainCount = Math.floor(total * trainRatio);
const valCount   = Math.floor(total * valRatio);
const testCount  = total - trainCount - valCount;

// Slice into splits
const trainLines = shuffled.slice(0, trainCount);
const valLines   = shuffled.slice(trainCount, trainCount + valCount);
const testLines  = shuffled.slice(trainCount + valCount);

// Write out splits
fs.writeFileSync(TRAIN_PATH, trainLines.join('\n') + '\n', 'utf8');
fs.writeFileSync(VAL_PATH,   valLines.join('\n')   + '\n', 'utf8');
fs.writeFileSync(TEST_PATH,  testLines.join('\n')  + '\n', 'utf8');

console.log(
  `Split into train=${trainLines.length}, val=${valLines.length}, test=${testLines.length}`
);