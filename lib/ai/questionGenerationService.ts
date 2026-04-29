import { generateText, Output } from "ai";
import { getOpenAIModel } from "@/lib/ai/provider";
import { questionBlockSchema } from "@/lib/courseBuilder/types";

export async function generateQuestionBlock(input: {
  courseTitle: string;
  chapterTitle: string;
  prompt: string;
  contextMarkdown: string;
}) {
  const model = getOpenAIModel("gpt-4o-mini");
  const fallback = () =>
    questionBlockSchema.parse({
      kind: "quiz",
      title: `${input.chapterTitle} knowledge check`,
      questions: [
        {
          type: "multiple_choice",
          question: "What is the core takeaway from this section?",
          options: ["Ignore safety checks", "Apply the documented process", "Skip verification"],
          answer: "Apply the documented process",
          explanation: "The lesson emphasizes safe, repeatable workflow steps.",
        },
        {
          type: "true_false",
          question: "Following a documented process reduces avoidable errors.",
          options: ["True", "False"],
          answer: "True",
          explanation: "Structured workflows reduce variance and risk.",
        },
        {
          type: "short_answer",
          question: "Name one moment when you should pause to verify your work.",
          answer: "Before proceeding to the next step (verification checkpoint).",
          explanation: "Verification checkpoints prevent compounding mistakes.",
        },
      ],
    });
  if (!model) {
    return fallback();
  }

  try {
    const result = await generateText({
      model,
      output: Output.object({ schema: questionBlockSchema }),
      prompt: `Generate a quiz block aligned to this lesson.
Course: ${input.courseTitle}
Chapter: ${input.chapterTitle}
Prompt: ${input.prompt}
Lesson context:
${input.contextMarkdown}

Include MCQ, short-answer, and true/false questions where appropriate.`,
    });

    return result.output;
  } catch {
    return fallback();
  }
}

