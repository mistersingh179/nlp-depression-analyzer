import * as readline from "node:readline";
import { z } from "zod";
import type { FunctionTool } from "openai/resources/responses/responses";
import { zodToJsonSchema } from "zod-to-json-schema";
import chalk from "chalk";

export const askQuestionInputSchema = z.object({
  questionString: z.string().describe("The question to ask the user"),
});
type AskQuestionInputType = z.infer<typeof askQuestionInputSchema>;

export const askQuestion = async (
  input: AskQuestionInputType
): Promise<string> => {
  const { questionString } = input;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const formattedQuestionString =
    chalk.bold.yellow("🤷‍♂️") + " " + chalk.green(questionString.trim() + " :   ") ;

  return new Promise((resolve) => {
    rl.question(formattedQuestionString, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

export const askQuestionTool: FunctionTool = {
  name: "askQuestion",
  description: "Asks user a question and gets the answer",
  parameters: zodToJsonSchema(askQuestionInputSchema),
  strict: true,
  type: "function",
};

if (require.main === module) {
  (async () => {
    const questionString = "What is your name?";
    const ans = await askQuestion({ questionString });
    console.log(`Question: ${questionString} and Answer: ${ans}`);
  })();
}
