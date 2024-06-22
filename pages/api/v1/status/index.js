import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  var postgresVersionQuery = new Object();
  postgresVersionQuery = await database.query("SHOW server_version");
  const postgresVersion = postgresVersionQuery.rows[0].server_version;

  var maxConnectionsQuery = new Object();
  maxConnectionsQuery = await database.query("SHOW max_connections");
  const maxConnections = maxConnectionsQuery.rows[0].max_connections;

  var activeConnectionsQuery = new Object();
  activeConnectionsQuery = await database.query(
    "SELECT COUNT(DISTINCT pid) FROM pg_stat_activity WHERE state='active';",
  );
  const activeConnections = activeConnectionsQuery.rows[0].count;
  // QUERY 2: SHOW server_version;

  response.status(200).json({
    updated_at: updatedAt,
    database_stats: {
      postgres_version: postgresVersion,
      max_connections: maxConnections,
      active_connections: activeConnections,
    },
  });
}

export default status;
