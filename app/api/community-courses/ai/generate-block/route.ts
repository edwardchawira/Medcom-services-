import { NextResponse } from "next/server";
import { orchestrateBlockGeneration } from "@/lib/ai/generationOrchestrator";
import { generateBlockRequestSchema } from "@/lib/courseBuilder/types";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = generateBlockRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const block = await orchestrateBlockGeneration(parsed.data);
    return NextResponse.json(
      { block },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Block generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

