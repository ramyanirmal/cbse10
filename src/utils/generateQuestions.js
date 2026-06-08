// src/utils/generateQuestions.js
import { getQuestionsForChapter, shuffle } from '../data/questionBank.js';

export async function generateQuestions({ subject, chapter, count = 10 }) {
  const pool = getQuestionsForChapter(subject.id, chapter?.id);

  if (pool.length === 0) {
    return getFallbackQuestions(subject.name);
  }

  const shuffled = shuffle(pool);
  // Take up to `count` questions; if bank is smaller just return all of them
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // Re-number ids sequentially so the UI stays consistent
  return selected.map((q, i) => ({ ...q, id: i + 1 }));
}

export function getFallbackQuestions(subjectName) {
  return [
    {
      id: 1, type: 'MCQ', marks: 1,
      question: `Which of the following is a fundamental concept in ${subjectName}?`,
      caseText: null,
      options: ['A) Concept A', 'B) Concept B', 'C) Concept C', 'D) Concept D'],
      answer: 'A',
      explanation: 'Questions for this chapter are coming soon. Try another chapter!',
    },
  ];
}


export { generateQuestions, getFallbackQuestions }