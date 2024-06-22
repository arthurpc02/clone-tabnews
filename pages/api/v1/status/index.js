import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  var postgresVersionQuery = new Object();
  postgresVersionQuery = await database.query("SHOW server_version");
  const postgresVersion = postgresVersionQuery.rows[0].server_version;

  var maxConnectionsQuery = new Object();
  maxConnectionsQuery = await database.query("SHOW max_connections");
  const maxConnectionsValue = maxConnectionsQuery.rows[0].max_connections;
  const maxConnectionsNumber = parseInt(maxConnectionsValue);

  var activeConnectionsQuery = new Object();
  // activeConnectionsQuery = await database.query(
  //   "SELECT COUNT(DISTINCT pid) FROM pg_stat_activity WHERE state='active';",
  // );
  activeConnectionsQuery = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db';",
  );
  const activeConnectionsValue = activeConnectionsQuery.rows[0].count;
  const activeConnectionsNumber = parseInt(activeConnectionsValue);

  response.status(200).json({
    updated_at: updatedAt,
    database_stats: {
      postgres_version: postgresVersion,
      max_connections: maxConnectionsNumber,
      active_connections: activeConnectionsNumber,
    },
  });
}

export default status;
