import webserver from "infra/webserver";
import activation from "models/activation";
import user from "models/user";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (all successful)", () => {
  let createUserResponseBody;
  let activationTokenId;
  let createSessionResponseBody;

  test("Create user account", async () => {
    const createUserResponse = await fetch(
      "http://localhost:3000/api/v1/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "RegistrationFlow",
          email: "registration.flow@curso.dev",
          password: "registrationFlowPassword",
        }),
      },
    );

    expect(createUserResponse.status).toBe(201); // created

    createUserResponseBody = await createUserResponse.json();

    expect(createUserResponseBody).toEqual({
      id: createUserResponseBody.id,
      username: "RegistrationFlow",
      email: "registration.flow@curso.dev",
      password: createUserResponseBody.password,
      features: ["read:activation_token"],
      created_at: createUserResponseBody.created_at,
      updated_at: createUserResponseBody.updated_at,
    });
  });

  test("Receive activation email", async () => {
    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@fintab.com.br>");
    expect(lastEmail.recipients[0]).toBe("<registration.flow@curso.dev>");
    expect(lastEmail.subject).toBe("Ative seu cadastro no FinTab!");
    expect(lastEmail.text).toContain("RegistrationFlow");

    activationTokenId = orchestrator.extractUUID(lastEmail.text);

    expect(lastEmail.text).toContain(
      `${webserver.origin}/cadastro/ativar/${activationTokenId}`,
    );

    const activationTokenObject =
      await activation.findOneValidById(activationTokenId);

    expect(activationTokenObject.user_id).toBe(createUserResponseBody.id);
    expect(activationTokenObject.used_at).toBe(null);
  });

  test("Activate account", async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/activation/${activationTokenId}`,
      {
        method: "PATCH",
      },
    );
    expect(response.status).toBe(200);
    const responseBodyActivationToken = await response.json();

    expect(responseBodyActivationToken.used_at).not.toBeNaN();

    // consulta user no DB e checa as features
    const updatedUser = await user.findOneByUsername("RegistrationFlow");
    expect(updatedUser.features).toEqual(["create:session", "read:session"]);
  });

  test("Login", async () => {
    const createSessionResponse = await fetch(
      "http://localhost:3000/api/v1/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "registration.flow@curso.dev",
          password: "registrationFlowPassword",
        }),
      },
    );

    expect(createSessionResponse.status).toBe(201); // created

    createSessionResponseBody = await createSessionResponse.json();
    expect(createSessionResponseBody.user_id).toBe(createUserResponseBody.id);
  });

  test("Get user information", async () => {
    const UserResponse = await fetch("http://localhost:3000/api/v1/user", {
      headers: {
        cookie: `session_id=${createSessionResponseBody.token}`,
      },
    });

    expect(UserResponse.status).toBe(200);

    const userResponseBody = await UserResponse.json();

    expect(userResponseBody.id).toBe(createUserResponseBody.id);
  });

  test("already activated should fail", async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/activation/${activationTokenId}`,
      {
        method: "PATCH",
      },
    );

    expect(response.status).toBe(403);
  });
});
