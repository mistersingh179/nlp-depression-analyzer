import {
  ResponseInputItem,
  ResponseOutputItem,
} from "openai/resources/responses/responses";
import { systemInstructions } from "./prompts/systemPromptReAct";
import {
  askQuestionTool,
  getSymptomsTool,
  provideFinalAnswerTool,
} from "./tools";
import OpenAI from "openai";

const openai = new OpenAI();

const agentStep = async (
  messages: ResponseInputItem[]
): Promise<ResponseOutputItem[]> => {

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    instructions: systemInstructions,
    input: messages,
    tools: [getSymptomsTool, askQuestionTool, provideFinalAnswerTool],
    tool_choice: "auto",
  });

  return response.output;
};

export default agentStep;
