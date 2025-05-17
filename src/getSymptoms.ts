import OpenAI from "openai";
import { z } from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";

export const getSymptomsInputSchema = z
  .object({
    text: z.string().describe("The user's full story in first person as narrated by the user itself used to extract depression symptoms"),
  })
  .describe("Input to getSymptoms tool");

type GetSymptomsInputType = z.infer<typeof getSymptomsInputSchema>;

const getSymptoms = async (input: GetSymptomsInputType) => {
  const { text } = input;
  console.log("in getSymptoms");

  const openai = new OpenAI();

  const response = await openai.responses.create({
    model: "ft:gpt-4.1-nano-2025-04-14:brandweaver-ai:sa-testing:BXthye9X",
    instructions:
      "You extract symptoms from the user input and reply ONLY in JSON with keys symptoms_present and symptoms_absent.",
    input: text,
  });

  console.log(response);
  try {
    const parsed = JSON.parse(response.output_text);
    console.log(parsed);
    return parsed;
  } catch (err) {
    console.log(err);
  }

  return { symptoms_present: [], symptoms_absent: [] };
};

// export the function for external usage
export default getSymptoms;

if (require.main === module) {
  (async () => {
    const text = "I dont feel like going to the gym today. I am feeling tired.";
    await getSymptoms({ text });
  })();
}
