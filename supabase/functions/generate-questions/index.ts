import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { subject, chapter, count, difficulty } = await req.json();

    const chapterLabel = chapter
      ? `Chapter ${chapter.id}: ${chapter.name}`
      : `Full ${subject.name} Syllabus`;

    const difficultyGuide: Record<string, string> = {
      easy: "focus on recall, definitions, and basic comprehension (CBSE 1-mark level)",
      medium: "mix of recall and application questions (CBSE 2-3 mark level)",
      hard: "application, analysis and higher-order thinking (CBSE 4-5 mark level)",
      mixed: "a realistic CBSE board exam mix — some recall, some application, some case-based",
    };

    const prompt = `You are an expert CBSE Class 10 question paper setter for academic year 2026-27.

Generate exactly ${count} multiple-choice questions for:
Subject: ${subject.name}
Topic: ${chapterLabel}
Difficulty: ${difficultyGuide[difficulty] ?? difficultyGuide.mixed}

CBSE 2026-27 pattern:
- ~50% Competency-Based / Case Study questions (type: "CBQ") — include a 2-3 sentence real-world or textbook passage, then ask a question about it
- ~20% Objective MCQ (type: "MCQ") — direct recall or concept check
- ~30% Short Answer styled as MCQ (type: "SA") — application or reasoning

Rules:
- Every question has exactly 4 options labeled A, B, C, D
- The answer field is exactly one letter: A, B, C, or D
- Write genuinely accurate CBSE-level content — no tricks, no ambiguous answers
- For CBQ: caseText is a short passage (2-3 sentences), question asks about it
- Explanation should be 1-2 sentences, educational, mention why the correct answer is right

Return ONLY a valid JSON array, no markdown, no backticks, no extra text:
[
  {
    "id": 1,
    "type": "MCQ",
    "marks": 1,
    "question": "...",
    "caseText": null,
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "answer": "A",
    "explanation": "..."
  }
]`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system:
          "You are a CBSE Class 10 exam expert. Return only valid JSON arrays. No markdown, no backticks, no preamble.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${response.status}`, detail: err }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const text = data.content?.map((i: { text?: string }) => i.text ?? "").join("") ?? "[]";
    const clean = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(clean);

    return new Response(JSON.stringify(questions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
