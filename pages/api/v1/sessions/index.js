import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import { UnauthorizedError } from "infra/errors.js";
import authentication from "models/authentication.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;

  const authenticatedUser = await authentication.getAuthenticatedUser(
    userInputValues.email,
    userInputValues.password,
  );

  return response.status(201).json({});
}
