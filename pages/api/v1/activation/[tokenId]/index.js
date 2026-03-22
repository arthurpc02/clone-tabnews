import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import activation from "models/activation";

const router = createRouter();

router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function patchHandler(request, response) {
  const tokenId = request.query.tokenId;

  const updatedUser = await activation.activate(tokenId);
  return response.status(200).json({ updatedUser });
}
