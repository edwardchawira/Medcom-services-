import { createOpenAI } from "@ai-sdk/openai";

export function getOpenAIModel(model: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  const openai = createOpenAI({ apiKey });
  return openai(model);
}

