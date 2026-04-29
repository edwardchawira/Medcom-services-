"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Wand2, Trash2, ArrowUp, ArrowDown, Eye, Pencil } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { MarkdownContent } from "@/components/MarkdownContent";
import {
  apiDeleteBlock,
  apiGenerateBlock,
  apiGenerateOutline,
  apiPatchBlock,
  apiRegenerateBlock,
  apiReorderBlocks,
} from "@/lib/courseBuilder/api";
import type { ContentBlock, ContentBlockPayload } from "@/lib/courseBuilder/types";

type Chapter = {
  id: string;
  title: string;
  sortOrder: number;
  blocks: ContentBlock[];
};

function tmpId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function markdownFromBlocks(blocks: ContentBlock[]) {
  return blocks
    .map((block) => {
      if (block.payload.kind === "text") return block.payload.markdown;
      if (block.payload.kind === "image") {
        if (!block.payload.imageUrl) return "";
        const caption = block.payload.caption ? `[${block.payload.caption}]` : "";
        return `![${block.payload.alt}](${block.payload.imageUrl})\n\n${caption}`;
      }
      return `### ${block.payload.title}\n\n${block.payload.questions.map((q) => `- ${q.question}`).join("\n")}`;
    })
    .join("\n\n");
}

function questionsFromBlocks(blocks: ContentBlock[]) {
  const quizBlocks = blocks.filter(
    (
      block
    ): block is ContentBlock & {
      payload: Extract<ContentBlock["payload"], { kind: "quiz" }>;
    } => block.payload.kind === "quiz"
  );
  return quizBlocks.flatMap((block) =>
    block.payload.questions.map((question) => ({
      prompt: question.question,
      options:
        question.type === "short_answer" ? ["Free text answer", "Keyword answer"] : question.options ?? ["True", "False"],
      correctIndex: 0,
      explanation: question.explanation ?? "",
    }))
  );
}

export function CourseBuilderV2() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [audienceText, setAudienceText] = useState("Care Assistant, Other staff");
  const [duration, setDuration] = useState("Self-paced");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [inlinePromptByBlock, setInlinePromptByBlock] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const outlineMutation = useMutation({
    mutationFn: apiGenerateOutline,
    onSuccess: (data) => {
      const generatedChapters: Chapter[] = data.outline.chapters.map((chapter, index) => {
        const chapterId = tmpId("tmp_chapter");
        const blockId = tmpId("tmp_block");
        return {
          id: chapterId,
          title: chapter.title,
          sortOrder: index + 1,
          blocks: [
            {
              id: blockId,
              chapterId,
              sortOrder: 1,
              source: "ai",
              status: "draft",
              payload: {
                kind: "text",
                title: chapter.title,
                markdown: chapter.lessonMarkdown,
              },
            },
          ],
        };
      });
      setChapters(generatedChapters);
      setSelectedChapterId(generatedChapters[0]?.id ?? null);
      setError(null);
    },
    onError: (mutationError) => setError(mutationError instanceof Error ? mutationError.message : "Outline generation failed."),
  });

  const generateBlockMutation = useMutation({
    mutationFn: apiGenerateBlock,
  });

  const regenerateBlockMutation = useMutation({
    mutationFn: apiRegenerateBlock,
  });

  const saveBlockMutation = useMutation({
    mutationFn: ({ blockId, payload }: { blockId: string; payload: ContentBlockPayload }) =>
      apiPatchBlock(blockId, payload),
  });

  const reorderMutation = useMutation({
    mutationFn: apiReorderBlocks,
  });

  const deleteMutation = useMutation({
    mutationFn: apiDeleteBlock,
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const publishBody = {
        title,
        category: "Community",
        duration,
        audience: audienceText
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean),
        learning_outcomes: ["Generated with AI-assisted builder", "Edited and validated by author"],
        assessment_html: "## Final assessment\n\nComplete each question and review your answers.",
        chapters: chapters.map((chapter) => ({
          title: chapter.title,
          content: markdownFromBlocks(chapter.blocks),
          questions: questionsFromBlocks(chapter.blocks),
        })),
      };

      const response = await fetch("/api/community-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publishBody),
      });
      const payload = (await response.json()) as { slug?: string; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not publish course.");
      }
      return payload;
    },
    onSuccess: (data) => {
      if (data.slug) {
        router.push(`/courses/community/${data.slug}/overview`);
      }
    },
    onError: (mutationError) => setError(mutationError instanceof Error ? mutationError.message : "Publish failed."),
  });

  const selectedChapter = useMemo(
    () => chapters.find((chapter) => chapter.id === selectedChapterId) ?? chapters[0] ?? null,
    [chapters, selectedChapterId]
  );

  async function addGeneratedBlock(blockType: "text" | "image" | "quiz") {
    if (!selectedChapter) return;
    const chapter = selectedChapter;
    const ctx = markdownFromBlocks(chapter.blocks);
    const blockPrompt = prompt || `Generate a ${blockType} block for ${chapter.title}`;
    const generated = await generateBlockMutation.mutateAsync({
      chapterTitle: chapter.title,
      courseTitle: title || "Untitled course",
      contextMarkdown: ctx,
      blockType,
      prompt: blockPrompt,
    });

    setChapters((current) =>
      current.map((entry) => {
        if (entry.id !== chapter.id) return entry;
        const nextSort = entry.blocks.length + 1;
        return {
          ...entry,
          blocks: [
            ...entry.blocks,
            {
              id: tmpId("tmp_block"),
              chapterId: chapter.id,
              sortOrder: nextSort,
              source: "ai",
              status: "draft",
              payload: generated.block,
            },
          ],
        };
      })
    );
  }

  async function regenerateBlock(block: ContentBlock) {
    if (!selectedChapter) return;
    const promptOverride = inlinePromptByBlock[block.id] || prompt || "Regenerate this block with improved clarity.";
    const result = await regenerateBlockMutation.mutateAsync({
      blockId: block.id,
      chapterTitle: selectedChapter.title,
      courseTitle: title || "Untitled course",
      contextMarkdown: markdownFromBlocks(selectedChapter.blocks),
      blockType: block.payload.kind,
      prompt: promptOverride,
    });

    setChapters((current) =>
      current.map((chapter) =>
        chapter.id === selectedChapter.id
          ? {
              ...chapter,
              blocks: chapter.blocks.map((entry) =>
                entry.id === block.id ? { ...entry, payload: result.block, source: "ai" } : entry
              ),
            }
          : chapter
      )
    );
  }

  async function reorderBlock(blockId: string, direction: "up" | "down") {
    if (!selectedChapter) return;
    const currentBlocks = [...selectedChapter.blocks].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = currentBlocks.findIndex((block) => block.id === blockId);
    if (index < 0) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= currentBlocks.length) return;
    [currentBlocks[index], currentBlocks[swapIndex]] = [currentBlocks[swapIndex], currentBlocks[index]];
    const normalized = currentBlocks.map((block, idx) => ({ ...block, sortOrder: idx + 1 }));

    setChapters((current) =>
      current.map((chapter) => (chapter.id === selectedChapter.id ? { ...chapter, blocks: normalized } : chapter))
    );

    const persisted = normalized.filter((block) => !block.id.startsWith("tmp_")).map((block) => ({ id: block.id, sortOrder: block.sortOrder }));
    if (persisted.length > 0) {
      await reorderMutation.mutateAsync(persisted);
    }
  }

  async function deleteBlock(blockId: string) {
    if (!selectedChapter) return;
    setChapters((current) =>
      current.map((chapter) =>
        chapter.id === selectedChapter.id
          ? { ...chapter, blocks: chapter.blocks.filter((block) => block.id !== blockId) }
          : chapter
      )
    );
    if (!blockId.startsWith("tmp_")) {
      await deleteMutation.mutateAsync(blockId);
    }
  }

  async function saveInline(block: ContentBlock, payload: ContentBlockPayload) {
    setChapters((current) =>
      current.map((chapter) =>
        chapter.id === block.chapterId
          ? { ...chapter, blocks: chapter.blocks.map((entry) => (entry.id === block.id ? { ...entry, payload } : entry)) }
          : chapter
      )
    );
    if (!block.id.startsWith("tmp_")) {
      await saveBlockMutation.mutateAsync({ blockId: block.id, payload });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 text-slate-800">
            <Sparkles className="h-5 w-5 text-teal-600" />
            <h1 className="text-xl font-semibold">AI Course Builder</h1>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Generate a full course outline, then edit and regenerate text, image, and assessment blocks.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Course title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <input
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Audience (comma-separated)"
              value={audienceText}
              onChange={(event) => setAudienceText(event.target.value)}
            />
            <input
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Duration"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            />
            <textarea
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm md:col-span-2"
              rows={3}
              placeholder="Prompt the AI to generate your course..."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                outlineMutation.mutate({
                  title: title || "Untitled course",
                  prompt,
                  audience: audienceText
                    .split(",")
                    .map((entry) => entry.trim())
                    .filter(Boolean),
                  level: "intermediate",
                  duration,
                })
              }
              disabled={!prompt || outlineMutation.isPending}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
            >
              {outlineMutation.isPending ? "Generating..." : "Generate course outline"}
            </button>
            <button
              type="button"
              onClick={() => publishMutation.mutate()}
              disabled={chapters.length === 0 || publishMutation.isPending}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              {publishMutation.isPending ? "Publishing..." : "Publish course"}
            </button>
          </div>
          {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Modules</h2>
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => setSelectedChapterId(chapter.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    selectedChapter?.id === chapter.id
                      ? "border-teal-300 bg-teal-50 text-teal-900"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-medium">{chapter.title}</p>
                  <p className="text-xs opacity-80">{chapter.blocks.length} blocks</p>
                </button>
              ))}
            </div>
            {selectedChapter ? (
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button type="button" className="rounded-lg bg-slate-100 px-2 py-2 text-xs" onClick={() => void addGeneratedBlock("text")}>
                  + Text
                </button>
                <button type="button" className="rounded-lg bg-slate-100 px-2 py-2 text-xs" onClick={() => void addGeneratedBlock("image")}>
                  + Image
                </button>
                <button type="button" className="rounded-lg bg-slate-100 px-2 py-2 text-xs" onClick={() => void addGeneratedBlock("quiz")}>
                  + Quiz
                </button>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Editable blocks</h2>
            {!selectedChapter ? (
              <p className="text-sm text-slate-500">Generate an outline to start editing.</p>
            ) : (
              <div className="space-y-3">
                {selectedChapter.blocks
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((block) => (
                    <motion.div
                      key={block.id}
                      layout
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                      whileHover={{ y: -2 }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600">
                          {block.payload.kind}
                        </span>
                        <div className="flex items-center gap-1">
                          <button className="rounded-md p-1 hover:bg-slate-200" onClick={() => void reorderBlock(block.id, "up")}>
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button className="rounded-md p-1 hover:bg-slate-200" onClick={() => void reorderBlock(block.id, "down")}>
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button className="rounded-md p-1 hover:bg-slate-200" onClick={() => void regenerateBlock(block)}>
                            <Wand2 className="h-4 w-4" />
                          </button>
                          <button className="rounded-md p-1 text-rose-600 hover:bg-rose-50" onClick={() => void deleteBlock(block.id)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {block.payload.kind === "text" ? (() => {
                        const textPayload = block.payload;
                        return (
                          <textarea
                            rows={6}
                            value={textPayload.markdown}
                            onChange={(event) =>
                              void saveInline(block, {
                                kind: "text",
                                title: textPayload.title,
                                markdown: event.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                          />
                        );
                      })() : null}

                      {block.payload.kind === "image" ? (() => {
                        const imagePayload = block.payload;
                        return (
                          <div className="space-y-2">
                            <input
                              value={imagePayload.imageUrl}
                              onChange={(event) =>
                                void saveInline(block, {
                                  kind: "image",
                                  prompt: imagePayload.prompt,
                                  alt: imagePayload.alt,
                                  caption: imagePayload.caption,
                                  imageUrl: event.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                            />
                            <input
                              value={imagePayload.caption ?? ""}
                              onChange={(event) =>
                                void saveInline(block, {
                                  kind: "image",
                                  prompt: imagePayload.prompt,
                                  alt: imagePayload.alt,
                                  imageUrl: imagePayload.imageUrl,
                                  caption: event.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                            />
                          </div>
                        );
                      })() : null}

                      {block.payload.kind === "quiz" ? (() => {
                        const quizPayload = block.payload;
                        return (
                          <div className="space-y-2">
                            {quizPayload.questions.map((question, index) => (
                              <div key={`${block.id}-${index}`} className="rounded-lg border border-slate-200 bg-white p-2">
                                <p className="text-xs font-semibold uppercase text-slate-500">{question.type}</p>
                                <input
                                  value={question.question}
                                  onChange={(event) => {
                                    const questions = quizPayload.questions.map((item, itemIndex) =>
                                      itemIndex === index ? { ...item, question: event.target.value } : item
                                    );
                                    void saveInline(block, {
                                      kind: "quiz",
                                      title: quizPayload.title,
                                      questions,
                                    });
                                  }}
                                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                                />
                              </div>
                            ))}
                          </div>
                        );
                      })() : null}

                      <div className="mt-2">
                        <input
                          value={inlinePromptByBlock[block.id] ?? ""}
                          onChange={(event) =>
                            setInlinePromptByBlock((current) => ({ ...current, [block.id]: event.target.value }))
                          }
                          placeholder="Optional regeneration instruction"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                        />
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Eye className="h-4 w-4 text-teal-600" />
              Live preview
            </div>
            {!selectedChapter ? (
              <p className="text-sm text-slate-500">Preview appears once you select a module.</p>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">{selectedChapter.title}</h3>
                {selectedChapter.blocks
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((block) => (
                    <div key={`preview-${block.id}`} className="rounded-xl border border-slate-200 p-3">
                      {block.payload.kind === "text" ? (
                        <MarkdownContent markdown={block.payload.markdown} />
                      ) : null}
                      {block.payload.kind === "image" ? (
                        <figure className="space-y-2">
                          {block.payload.imageUrl ? (
                            <img
                              src={block.payload.imageUrl}
                              alt={block.payload.alt}
                              className="w-full rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
                              No image URL set
                            </div>
                          )}
                          {block.payload.caption ? <figcaption className="text-xs text-slate-600">{block.payload.caption}</figcaption> : null}
                        </figure>
                      ) : null}
                      {block.payload.kind === "quiz" ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">{block.payload.title}</p>
                          <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
                            {block.payload.questions.map((question, index) => (
                              <li key={`${block.id}-preview-q-${index}`}>{question.question}</li>
                            ))}
                          </ol>
                        </div>
                      ) : null}
                    </div>
                  ))}
              </div>
            )}
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-600">
              <div className="mb-1 flex items-center gap-1 font-medium text-slate-700">
                <Pencil className="h-3.5 w-3.5" /> Versioning and history
              </div>
              Every regeneration is written to `community_course_block_versions` and can be restored in a later UI pass.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

