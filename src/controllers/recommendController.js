import { validateAnswers } from "../utils/validation.js";
import { getRecommendations } from "../services/recommendationService.js";
import { ANSWER_MAP } from "../utils/constants.js";

export default async function recommendController(request, env) {
  try {
    const body = await request.json();

    // Validate the answers
    const validation = validateAnswers(body);
    if (!validation.ok) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    //Map answers to their text representations
    const mappedAnswers = {};
    for (const questionKey of Object.keys(body)) {
      const answerValue = body[questionKey];
      mappedAnswers[questionKey] = ANSWER_MAP[questionKey][answerValue];
    }

    //Recomendation service
    const recommendations = await getRecommendations(mappedAnswers, env);

    return new Response(JSON.stringify({ recommendations }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in recommendController:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
