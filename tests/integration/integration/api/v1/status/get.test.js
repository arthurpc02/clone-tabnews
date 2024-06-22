test("Get to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdateAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toBe(parsedUpdateAt);

  const postgres_version = responseBody.database_stats.postgres_version;
  expect(postgres_version).toEqual("16.0");

  const max_connections = responseBody.database_stats.max_connections;
  expect(max_connections).toBeDefined();
  expect(max_connections).not.toBe(null);

  const active_connections = responseBody.database_stats.active_connections;
  expect(active_connections).toBeDefined();
  expect(active_connections).not.toBe(null);
});
