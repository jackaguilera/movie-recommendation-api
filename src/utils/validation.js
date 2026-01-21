import { ANSWER_MAP, QUESTION_MAP } from "./constants.js";

export function validateAnswers(body) {
  for (const questionKey of Object.keys(QUESTION_MAP)) {
    const questionText = QUESTION_MAP[questionKey];
    const answerValue = body[questionKey];

    if (answerValue === undefined) {
      return { ok: false, error: `Missing answer for ${questionText}` };
    }

    if (typeof answerValue !== "number" || !Number.isInteger(answerValue)) {
      return {
        ok: false,
        error: `Answer for ${questionText} must be an integer`,
      };
    }

    const validAnswers = ANSWER_MAP[questionKey];
    if (!validAnswers || !validAnswers[answerValue]) {
      return { ok: false, error: `Invalid answer for ${questionText}` };
    }
  }

  return { ok: true };
}
