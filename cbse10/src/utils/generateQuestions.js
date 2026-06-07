// src/utils/generateQuestions.js

export async function generateQuestions({ subject, chapter, count = 10, difficulty = 'mixed' }) {
  const chapterLabel = chapter
    ? `Chapter ${chapter.id}: ${chapter.name}`
    : `Full ${subject.name} Syllabus`;

  const difficultyGuide = {
    easy: 'focus on recall, definitions, and basic comprehension (CBSE 1-mark level)',
    medium: 'mix of recall and application questions (CBSE 2-3 mark level)',
    hard: 'application, analysis and higher-order thinking (CBSE 4-5 mark level)',
    mixed: 'a realistic CBSE board exam mix — some recall, some application, some case-based'
  }[difficulty];

  const prompt = `You are an expert CBSE Class 10 question paper setter for academic year 2026-27.

Generate exactly ${count} multiple-choice questions for:
Subject: ${subject.name}
Topic: ${chapterLabel}
Difficulty: ${difficultyGuide}

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

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: 'You are a CBSE Class 10 exam expert. Return only valid JSON arrays. No markdown, no backticks, no preamble.',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  const text = data.content?.map(i => i.text || '').join('') || '[]';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// Fallback questions if API fails
export function getFallbackQuestions(subjectName) {
  return [
    {
      id: 1, type: 'MCQ', marks: 1,
      question: `Which of the following is a fundamental concept in ${subjectName}?`,
      caseText: null,
      options: ['A) Concept A', 'B) Concept B', 'C) Concept C', 'D) Concept D'],
      answer: 'A',
      explanation: 'This is a fallback question. Please check your internet connection and try again for AI-generated questions.'
    },
  ];
}
