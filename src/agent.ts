import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions/completions";
import { ResponseInputItem } from "openai/resources/responses/responses";
import type { FunctionTool } from "openai/resources/responses/responses";
import * as readline from "node:readline";
import { z } from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";
import {getSymptoms, getSymptomsInputSchema} from "./tools/getSymptoms";
import type { ResponseFunctionToolCall } from "openai/resources/responses/responses";

const openai = new OpenAI();

(async () => {
  // setup console input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = (prompt: string) =>
    new Promise<string>((resolve) => rl.question(prompt, resolve));

  const messages: ResponseInputItem[] = [];
  const first = await question("You: ");
  messages.push({ role: "user", content: first });

  const getSymptomsTool: FunctionTool = {
    name: "getSymptoms",
    description: "Extract present and absent depression symptoms from the entire available user text / story",
    parameters: zodToJsonSchema(getSymptomsInputSchema),
    strict: true,
    type: "function"
  };

  let loop = true;
  while (loop) {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "ask the user about how they are doing and feeling. " +
        "Make a reasonable effort to collect all information." +
        "When you feel a decent amount of information or whatever could be " +
        "easily gotten has been made available, then send that user story " +
        "as presented by the to the user in their first person voice to the tool " +
        "so that the tool can identify depression symptoms. " +
        "The text you send to the tool should be the story as the user has presented by blending in your questions within their answer. " +
        "Dont ask very length questions, keep your questions to the user limited to 1 sentence" +
        "Finally give your response listing out the depression symptoms as a JSON array." +
        "Your final answer should start with prefix Answer: ",
      input: messages,
      tools: [getSymptomsTool],
      tool_choice: 'auto',
    });
    // extract the first output item
    const outputItem = response.output[0];
    let content = "";
    if (outputItem.type === "message" && Array.isArray(outputItem.content)) {
      for (const part of outputItem.content) {
        if (part.type === "output_text" && "text" in part) {
          content += part.text;
        }
      }
      content = content.trim();
    }
    // handle tool invocation vs. normal assistant message
    if (outputItem.type === 'function_call') {
      // model is asking us to run the getSymptoms tool
      const fnCall = outputItem as ResponseFunctionToolCall;
      console.log(`Calling tool ${fnCall.name} with args:`, fnCall.arguments);
      let args;
      try { args = JSON.parse(fnCall.arguments); } catch { args = { text: '' }; }
      // run the extraction
      const result = await getSymptoms(args);
      console.log('Tool getSymptoms returned:', result);
      // record the function call invocation
      messages.push(fnCall);
      // record the function call output
      const toolOutput: ResponseInputItem.FunctionCallOutput = {
        type: 'function_call_output',
        call_id: fnCall.call_id,
        output: JSON.stringify(result),
        status: 'completed'
      };
      messages.push(toolOutput);
      // continue the loop to let model see tool result
      continue;
    }
    if (outputItem.type === 'message') {
      // record the assistant's message
      messages.push(outputItem);
      console.log("Assistant:", content);
      // if the assistant has provided the final answer, exit
      if (content.includes("Answer:")) {
        console.log('Final answer received, exiting.');
        console.log("*** messages: ", messages);
        break;
      }
      // otherwise ask the user for follow-up
      const followUp = await question("You: ");
      messages.push({ role: "user", content: followUp });
      continue;
    }
  }
  // close readline interface
  rl.close();
})();
