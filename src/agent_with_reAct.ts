import OpenAI from "openai";
import { ResponseInputItem } from "openai/resources/responses/responses";
import {
  askQuestion,
  askQuestionTool,
  getSymptoms,
  getSymptomsTool,
  provideFinalAnswerTool,
} from "./tools";
import {systemInstructions} from "./prompts/systemPromptReAct";

const openai = new OpenAI();

(async () => {
  // setup console input

  const messages: ResponseInputItem[] = [];
  const answer = await askQuestion({ questionString: "Hello" });

  messages.push({ role: "user", content: answer });

  let loop = true;
  while (loop) {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: systemInstructions,
      input: messages,
      tools: [getSymptomsTool, askQuestionTool, provideFinalAnswerTool],
      tool_choice: "auto",
    });

    const toolCallExists = response.output.some((outputItem) => {
      return outputItem.type === "function_call";
    });

    if (!toolCallExists) {
      messages.push({
        role: "user",
        content: "Please respond only by calling tools.",
      });
      continue;
    }

    for (const outputItem of response.output) {
      messages.push(outputItem);
      if (outputItem.type === "message") {
        const content = outputItem.content
          .map((part) => {
            if (part.type === "output_text" && "text" in part) {
              return part.text;
            }
            return "";
          })
          .join("\n")
          .trim();
        console.log(content);
      } else if (outputItem.type === "function_call") {
        let answer = "";
        switch (outputItem.name) {
          case "askQuestion":
            answer = await askQuestion(JSON.parse(outputItem.arguments));
            break;
          case "getSymptoms":
            answer = await getSymptoms(JSON.parse(outputItem.arguments));
            break;
          case "provideFinalAnswer":
            const finalArgs = JSON.parse(outputItem.arguments || "{}");
            console.log("Answer:", finalArgs.answer);
            console.log("Final answer received, exiting.");
            console.log("*** messages: ", messages);
            loop = false;
            break;
          default:
            console.log("Unknown tool called: ", outputItem.name);
            answer = "Unable to process tool call";
        }
        const toolOutput: ResponseInputItem.FunctionCallOutput = {
          type: "function_call_output",
          call_id: outputItem.call_id,
          output: JSON.stringify(answer),
          status: "completed",
        };
        messages.push(toolOutput);
      }
    }
  }
})();
