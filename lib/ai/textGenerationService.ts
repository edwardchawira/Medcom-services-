import { generateText, Output } from "ai";
import { z } from "zod";
import { getOpenAIModel } from "@/lib/ai/provider";
import { textBlockSchema } from "@/lib/courseBuilder/types";

const generatedOutlineSchema = z.object({
  chapters: z.array(
    z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
      lessonMarkdown: z.string().min(1),
    })
  ),
});

export async function generateCourseOutline(input: {
  title: string;
  prompt: string;
  audience: string[];
  level: string;
  duration: string;
}) {
  const model = getOpenAIModel("gpt-4o-mini");
  if (!model) {
    return {
      chapters: [
        {
          title: "Generated Introduction",
          summary: `Overview for ${input.title}`,
          lessonMarkdown: `## ${input.title}\n\n${input.prompt}\n\n- Audience: ${input.audience.join(", ") || "General"}\n- Level: ${input.level}\n- Duration: ${input.duration}`,
        },
      ],
    };
  }

  const result = await generateText({
    model,
    output: Output.object({ schema: generatedOutlineSchema }),
    prompt: `Create an educational course outline.
Title: ${input.title}
Audience: ${input.audience.join(", ") || "General"}
Level: ${input.level}
Duration: ${input.duration}
User prompt: ${input.prompt}

Return 3-6 chapters with practical summaries and lesson markdown.`,
  });

  return result.output;
}

export async function generateTextBlock(input: {
  courseTitle: string;
  chapterTitle: string;
  prompt: string;
  contextMarkdown: string;
}) {
  const model = getOpenAIModel("gpt-4o-mini");
  if (!model) {
    return textBlockSchema.parse({
      kind: "text",
      title: `${input.chapterTitle} lesson`,
      markdown: `### ${input.chapterTitle}\n\n${input.prompt}\n\n- Context enriched from current draft\n- Add references and examples`,
    });
  }

  const result = await generateText({
    model,
    output: Output.object({ schema: textBlockSchema }),
    prompt: `Generate one structured learning text block for a course.
Course: ${input.courseTitle}
Chapter: ${input.chapterTitle}
Prompt: ${input.prompt}
Current context markdown: ${input.contextMarkdown}

Return markdown with headings, concise paragraphs, and bullet points.`,
  });

  return result.output;
}

