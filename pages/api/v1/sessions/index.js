import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import { UnauthorizedError } from "infra/errors.js";
import password from "models/password";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;

  try {
    const storedUser = await user.findOneByEmail(userInputValues.email);
    const correctPasswordMatch = await password.compare(
      userInputValues.password,
      storedUser.password,
    );
    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Senha não confere.",
        action: "Verifique se este dado está.",
      });
    }
  } catch (error) {
    throw new UnauthorizedError({
      message: "Dados de autenticação não conferem.",
      action: "Verifique se os dados enviados estão corretos.",
    });
  }

  return response.status(201).json({});
}
