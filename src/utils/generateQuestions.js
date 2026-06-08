// src/utils/generateQuestions.js

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-questions`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function generateQuestions({ subject, chapter, count = 10, difficulty = 'mixed' }) {
  const response = await fetch(EDGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
      'Apikey': ANON_KEY,
    },
    body: JSON.stringify({ subject, chapter, count, difficulty }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Edge function error: ${response.status}`);
  }

  const questions = await response.json();
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('No questions returned from AI');
  }
  return questions;
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
