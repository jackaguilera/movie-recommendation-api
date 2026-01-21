import { recommendController } from "../controllers/recommendController.js";

export default async function recommendRoute(request, env, ctx) {
  return recommendController(request, env, ctx);
}
