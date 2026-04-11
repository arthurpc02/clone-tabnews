import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Running pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
      });
      expect(response.status).toBe(403);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Você não possui permissão para executar esta ação.",
        action:
          'Verifique se o seu usuário possui a feature "create:migrations"',
        statusCode: 403,
      });
    });
  });

  describe("Default user", () => {
    test("Running pending migrations", async () => {
      await orchestrator.runNMigrations(3); // orchestrator has to run the first migrations, to create the USERS and FEATURES.

      const DefaultUser = await orchestrator.createUser();
      const activatedDefaultUser = await orchestrator.activateUser(
        DefaultUser.id,
      );

      const DefaultUserSession = await orchestrator.createSession(
        activatedDefaultUser.id,
      );

      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${DefaultUserSession.token}`,
        },
      });
      expect(response.status).toBe(403);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Você não possui permissão para executar esta ação.",
        action:
          'Verifique se o seu usuário possui a feature "create:migrations"',
        statusCode: 403,
      });
    });
  });

  describe("Privileged user", () => {
    describe("Running pending migrations", () => {
      let privilegedUserSession;

      test("For the first time", async () => {
        // await orchestrator.runNMigrations(3); // migrations for USERS and FEATURES were run on the test for the Default User.

        const privilegedUser = await orchestrator.createUser();
        const activatedPrivilegedUser = await orchestrator.activateUser(
          privilegedUser.id,
        );

        await orchestrator.addFeaturesToUser(privilegedUser, [
          "create:migrations",
        ]);

        privilegedUserSession = await orchestrator.createSession(
          activatedPrivilegedUser.id,
        );

        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: `session_id=${privilegedUserSession.token}`,
            },
          },
        );
        expect(response1.status).toBe(201); // created

        const response1Body = await response1.json();
        // console.log(response1Body);

        expect(Array.isArray(response1Body)).toBe(true);
        expect(response1Body.length).toBeGreaterThan(0);
      });

      test("For the second time", async () => {
        // another post, this time we don't expect the migrations to excute because they
        // were already executed in response1.
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: `session_id=${privilegedUserSession.token}`,
            },
          },
        );
        expect(response2.status).toBe(200);

        const response2Body = await response2.json();
        console.log(response2Body);

        expect(Array.isArray(response2Body)).toBe(true);
        expect(response2Body.length).toBe(0);
      });
    });
  });
});
