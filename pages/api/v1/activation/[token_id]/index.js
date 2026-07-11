import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import activation from "models/activation.js";
import authorization from "models/authorization";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .patch(controller.canRequest("read:activation_token"), patchHandler)
  .handler(controller.errorHandlers);

async function patchHandler(request, response) {
  const userTryingToPatch = request.context.user;
  const tokenId = request.query.token_id;

  const updatedToken = await activation.activate(tokenId);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPatch,
    "read:activation_token",
    updatedToken,
  );

  return response.status(200).json(secureOutputValues);
}
