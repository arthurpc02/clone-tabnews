import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.use(dbMiddleware);
router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function dbMiddleware(request, response, next) {
  const dbClient = await database.getNewClient();
  request.dbClient = dbClient;

  try {
    await next(); // run handlers
  } finally {
    // ALWAYS runs: success, throw, or early return
    await dbClient.end();
  }
}

async function getHandler(request, response) {
  const defaultMigrationOptions = {
    dbClient: request.dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  const pendingMigrations = await migrationRunner(defaultMigrationOptions);
  await request.dbClient.end();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const defaultMigrationOptions = {
    dbClient: request.dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  const migratedMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dryRun: false,
  });

  await request.dbClient.end();

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  return response.status(200).json(migratedMigrations);
}
