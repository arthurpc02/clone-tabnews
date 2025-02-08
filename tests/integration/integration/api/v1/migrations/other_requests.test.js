import database from "infra/database.js";

import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("Post to /api/v1/migrations should return 201", async () => {
  console.log(
    "Test desc.: Post to /api/v1/migrations with any method beside GET & POST should return 201",
  );

  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "DELETE",
  });
  expect(response1.status).toBe(405);

  // const response1Body = await response1.json();
  // console.log(response1Body);

  // expect(Array.isArray(response1Body)).toBe(true);
  // expect(response2Body.length).toBe(0);

  // // another request, different method
  // const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
  //   method: "PUT",
  // });
  // expect(response2.status).toBe(200);

  // const response2Body = await response2.json();
  // console.log(response2Body);

  // expect(Array.isArray(response2Body)).toBe(true);
  // expect(response2Body.length).toBe(0);
});
