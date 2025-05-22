import type {FunctionTool} from "openai/resources/responses/responses";
import {zodToJsonSchema} from "zod-to-json-schema";
import {z} from "zod";

export const provideFinalAnswerTool: FunctionTool = {
  name: "provideFinalAnswer",
  description: "Used to provide final answer",
  parameters: zodToJsonSchema(
    z.object({
      answer: z
        .string()
        .describe("The final answer which will be presented to the user"),
    })
  ),
  strict: true,
  type: "function",
};
