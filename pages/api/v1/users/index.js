import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";

const router = createRouter();

// router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  //return response.status(200).json({});
}

async function postHandler(request, response) {
  const userInputValues = request.body;

  const newUser = await user.create(userInputValues);
  return response.status(201).json(newUser);
}
