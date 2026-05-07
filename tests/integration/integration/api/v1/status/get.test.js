import orchestrator from "tests/orchestrator.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      console.log("Test desc.: Get to /api/v1/status should return 200");

      const response = await fetch(`${webserver.origin}/api/v1/status`);
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parsedUpdateAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toBe(parsedUpdateAt);

      const max_connections =
        responseBody.dependencies.database.max_connections;
      expect(max_connections).toBeDefined();
      expect(max_connections).not.toBe(null);

      const active_connections =
        responseBody.dependencies.database.active_connections;
      expect(active_connections).toEqual(1);

      expect(responseBody.dependencies.database).not.toHaveProperty("version");
    });
  });

  describe("Default user", () => {
    test("Retrieving current system status", async () => {
      const DefaultUser = await orchestrator.createUser();
      const activatedDefaultUser = await orchestrator.activateUser(
        DefaultUser.id,
      );

      const DefaultUserSession = await orchestrator.createSession(
        activatedDefaultUser.id,
      );

      const response = await fetch(`${webserver.origin}/api/v1/status`, {
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${DefaultUserSession.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parsedUpdateAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toBe(parsedUpdateAt);

      const max_connections =
        responseBody.dependencies.database.max_connections;
      expect(max_connections).toBeDefined();
      expect(max_connections).not.toBe(null);

      const active_connections =
        responseBody.dependencies.database.active_connections;
      expect(active_connections).toEqual(1);

      expect(responseBody.dependencies.database).not.toHaveProperty("version");
    });
  });

  describe("Privileged user", () => {
    test("Retrieving current system status", async () => {
      const privilegedUser = await orchestrator.createUser();
      const activatedPrivilegedUser = await orchestrator.activateUser(
        privilegedUser.id,
      );

      await orchestrator.addFeaturesToUser(privilegedUser, ["read:status:all"]);

      const privilegedUserSession = await orchestrator.createSession(
        activatedPrivilegedUser.id,
      );

      const response = await fetch(`${webserver.origin}/api/v1/status`, {
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${privilegedUserSession.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parsedUpdateAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toBe(parsedUpdateAt);

      const postgres_version =
        responseBody.dependencies.database.postgres_version;
      expect(postgres_version).toEqual("16.0");

      const max_connections =
        responseBody.dependencies.database.max_connections;
      expect(max_connections).toBeDefined();
      expect(max_connections).not.toBe(null);

      const active_connections =
        responseBody.dependencies.database.active_connections;
      expect(active_connections).toEqual(1);
    });
  });
});
