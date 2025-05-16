import fs from 'fs';
import * as readline from "node:readline";

const rl = readline.createInterface({
  input: fs.createReadStream('./data/primate_dataset.jsonl', 'utf8'),
  // input: fs.createReadStream('./data/primate_train.jsonl', 'utf8'),
  crlfDelay: Infinity
});

(async () => {
  let lineCount = 0;
  for await (const line of rl){
    const data = JSON.parse(line);

    console.log(data);
    return;

    console.log(data.messages[0].content);
    console.log(data.messages[1].content);

    const ans = JSON.parse(data.completion.content);
    console.log(ans);

    lineCount = lineCount + 1;
    if(lineCount === 2){
      break;
    }
  }
})();
