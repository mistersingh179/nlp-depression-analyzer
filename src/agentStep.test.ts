import agentStep from "./agentStep";
import {ResponseInputItem} from "openai/resources/responses/responses";

it("i am sane", () => {
  expect(1).toBe(1);
})

describe("agentStep", () => {
  it("is defined and returns a Promise", async () => {
    const result = agentStep([])
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Promise);
  })

  it("when called with messages, it returns an array of messages", async () => {
    const message: ResponseInputItem = {
      role: 'user',
      content: 'Hello'
    };
    const result = await agentStep([message]);
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]?.type).toBe('message');
    console.log(result);
  }, 10_000)
})
