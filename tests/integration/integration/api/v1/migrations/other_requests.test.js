import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("Non-Permitted Method /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Using DELETE Method", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "DELETE",
      });

      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para este endpoint.",
        action:
          "Verifique se o método HTTP enviado é válido para este endpoint.",
        statusCode: 405,
      });
    });

    test("Using PUT Method", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "PUT",
      });

      expect(response.status).toBe(405);
    });
  });
});
