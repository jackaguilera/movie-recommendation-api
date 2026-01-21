export async function recommendService(answers, env) {
  const { userNeed, mentalEnergy, experienceType } = answers;

  console.log("Received answers:", answers);

  const prompt = `You recommend ONE specific movie matching user needs. Return ONLY valid JSON.

User Need: ${userNeed}
Mental Energy: ${mentalEnergy}
Experience Type: ${experienceType}

Match all three dimensions. Real movie only. No disclaimers.`;

  const payload = {
    prompt: prompt,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "movie_recommendation",
        schema: {
          type: "object",
          properties: {
            movie: {
              type: "string",
              description: "Movie title with release year",
            },
            reason: {
              type: "string",
              description:
                "Why this matches their need, energy, and experience",
            },
            director: {
              type: "string",
              description: "Director name",
            },
          },
          required: ["movie", "reason", "director"],
          additionalProperties: false,
        },
      },
    },
    max_tokens: 200,
    temperature: 0.6,
    top_p: 0.9,
    top_k: 40,
    repetition_penalty: 1.1,
    presence_penalty: 0.1,
    frequency_penalty: 0.05,
  };

  try {
    const response = await env.AI_API.fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${env.AI_MODEL_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.AI_API_KEY}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error("Failed to get recommendation from AI API");
    }

    const data = await response.json();

    let recommendation;
    try {
      recommendation = JSON.parse(data.response);
    } catch (parseError) {
      console.error("Failed to parse AI response:", data.response);
      throw new Error("AI returned invalid JSON");
    }

    return recommendation;
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    throw error;
  }
}
