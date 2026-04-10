import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runNMigrations(3); // run migrations until USERS and FEATURES have been implemented.
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Retrieving pending migrations", async () => {
      // console.log("Test desc.: Get to /api/v1/migrations should return 200");

      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(403);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Você não possui permissão para executar esta ação.",
        action: 'Verifique se o seu usuário possui a feature "read:migrations"',
        statusCode: 403,
      });
    });
  });

  describe("Privileged user", () => {
    test("Retrieving pending migrations", async () => {
      const privilegedUser = await orchestrator.createUser();
      const activatedPrivilegedUser = await orchestrator.activateUser(
        privilegedUser.id,
      );

      await orchestrator.addFeaturesToUser(privilegedUser, ["read:migrations"]);

      const privilegedUserSession = await orchestrator.createSession(
        activatedPrivilegedUser.id,
      );

      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${privilegedUserSession.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      // console.log(responseBody);

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
