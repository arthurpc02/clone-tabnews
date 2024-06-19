import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const postgresVersion = null;

  var maxConnectionsQuery = new Object();
  maxConnectionsQuery = await database.query("SHOW max_connections");
  const maxConnections = maxConnectionsQuery.rows[0].max_connections;

  var activeConnectionsQuery = new Object();
  activeConnectionsQuery = await database.query(
    "SELECT COUNT(DISTINCT pid) FROM pg_stat_activity WHERE state='active';",
  );
  const activeConnections = activeConnectionsQuery.rows[0].count;
  // QUERY 2: SELECT version()
  // QUERY 3: SELECT COUNT(DISTINCT pid) FROM pg_stat_activity WHERE state='active';

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
