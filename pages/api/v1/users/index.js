import activation from "models/activation.js";
import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";

const router = createRouter();

// router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

// async function getHandler(request, response) {
//   return response.status(200).json({});
// }

async function postHandler(request, response) {
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);

  const activationToken = await activation.create(newUser.id);
  await activation.sendEmailToUser(newUser, activationToken);

  return response.status(201).json(newUser);
}
