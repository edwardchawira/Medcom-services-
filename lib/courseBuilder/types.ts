import { z } from "zod";

export const textBlockSchema = z.object({
  kind: z.literal("text"),
  title: z.string().min(1),
  markdown: z.string().min(1),
});

export const imageBlockSchema = z.object({
  kind: z.literal("image"),
  prompt: z.string().min(1),
  imageUrl: z.string().url(),
  alt: z.string().min(1),
  caption: z.string().optional().default(""),
});

export const questionTypeSchema = z.enum(["multiple_choice", "short_answer", "true_false"]);

export const questionItemSchema = z.object({
  type: questionTypeSchema,
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  answer: z.string().min(1),
  explanation: z.string().optional().default(""),
});

export const questionBlockSchema = z.object({
  kind: z.literal("quiz"),
  title: z.string().min(1),
  questions: z.array(questionItemSchema).min(1),
});

export const contentBlockPayloadSchema = z.discriminatedUnion("kind", [
  textBlockSchema,
  imageBlockSchema,
  questionBlockSchema,
]);

export const contentBlockSchema = z.object({
  id: z.string().uuid().or(z.string().startsWith("tmp_")),
  chapterId: z.string().uuid().or(z.string().startsWith("tmp_chapter_")),
  sortOrder: z.number().int().min(1),
  source: z.enum(["manual", "ai"]).default("manual"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  payload: contentBlockPayloadSchema,
});

export const lessonChapterSchema = z.object({
  id: z.string().uuid().or(z.string().startsWith("tmp_chapter_")),
  title: z.string().min(1),
  sortOrder: z.number().int().min(1),
  blocks: z.array(contentBlockSchema),
});

export const courseDraftSchema = z.object({
  title: z.string().min(1),
  prompt: z.string().min(1),
  audience: z.array(z.string()).default([]),
  duration: z.string().default("Self-paced"),
  chapters: z.array(lessonChapterSchema).min(1),
});

export const generateOutlineRequestSchema = z.object({
  prompt: z.string().min(10),
  title: z.string().min(1),
  audience: z.array(z.string()).default([]),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  duration: z.string().default("Self-paced"),
});

export const generateBlockRequestSchema = z.object({
  chapterTitle: z.string().min(1),
  courseTitle: z.string().min(1),
  contextMarkdown: z.string().default(""),
  blockType: z.enum(["text", "image", "quiz"]),
  prompt: z.string().min(8),
});

export const regenerateBlockRequestSchema = z.object({
  blockId: z.string().min(1),
  blockType: z.enum(["text", "image", "quiz"]),
  prompt: z.string().min(8),
  courseTitle: z.string().min(1),
  chapterTitle: z.string().min(1),
  contextMarkdown: z.string().default(""),
});

export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type ContentBlockPayload = z.infer<typeof contentBlockPayloadSchema>;
export type CourseDraft = z.infer<typeof courseDraftSchema>;
export type GenerateOutlineRequest = z.infer<typeof generateOutlineRequestSchema>;
export type GenerateBlockRequest = z.infer<typeof generateBlockRequestSchema>;
