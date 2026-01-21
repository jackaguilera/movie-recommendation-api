import recommendRoute from "./routes/recommend.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/recommend" && request.method === "POST") {
      return recommendRoute(request, env, ctx);
    }

    return new Response("Movie Recommendation API is running.", {
      status: 200,
    });
  },
};
