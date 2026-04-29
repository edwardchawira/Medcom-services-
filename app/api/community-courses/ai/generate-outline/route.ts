import { NextResponse } from "next/server";
import { orchestrateOutlineGeneration } from "@/lib/ai/generationOrchestrator";
import { generateOutlineRequestSchema } from "@/lib/courseBuilder/types";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = generateOutlineRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const outline = await orchestrateOutlineGeneration(parsed.data);
  return NextResponse.json({ outline }, { status: 200, headers: { "Cache-Control": "no-store" } });
}

