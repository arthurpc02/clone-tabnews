import { createRouter } from "next-connect";

import controller from "infra/controller.js";
import migrator from "models/migrator";
import authorization from "models/authorization";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .get(controller.canRequest("read:migrations"), getHandler)
  .post(controller.canRequest("create:migrations"), postHandler)
  .handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userTryingToGet = request.context.user;
  const pendingMigrations = await migrator.listPendingMigrations();

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:migrations",
    pendingMigrations,
  );

  return response.status(200).json(secureOutputValues);
}

async function postHandler(request, response) {
  const userTryingToPost = request.context.user;
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    const secureOutputValues = authorization.filterOutput(
      userTryingToPost,
      "read:migrations",
      migratedMigrations,
    );

    return response.status(201).json(secureOutputValues);
  }

  return response.status(200).json([]);
}
