import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import {
  buildFigureAssistantSystemPrompt,
  figureAssistantResponseSchema,
} from "@/lib/figure-assistant";

export const runtime = "nodejs";

const MAX_PROMPT_CHARS = 8000;

type Body = {
  prompt?: string;
  mode?: string;
};

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json(
      {
        error:
          "Server is missing OPENAI_API_KEY. Add it to .env.local to enable the figure assistant.",
      },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return NextResponse.json(
      { error: `prompt exceeds ${MAX_PROMPT_CHARS} characters` },
      { status: 400 },
    );
  }

  const mode = body.mode === "consult" ? "consult" : "diagram";

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: figureAssistantResponseSchema,
      temperature: mode === "consult" ? 0.55 : 0.35,
      messages: [
        { role: "system", content: buildFigureAssistantSystemPrompt(mode) },
        {
          role: "user",
          content:
            mode === "consult"
              ? `Critique / advice request:\n${prompt}`
              : `Compose on my canvas:\n${prompt}`,
        },
      ],
    });

    return NextResponse.json(object);
  } catch (err) {
    console.error("[figure-assistant]", err);
    const message =
      err instanceof Error ? err.message : "Figure assistant generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
