import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  var maxConnectionsQuery = new Object();
  maxConnectionsQuery = await database.query("SHOW max_connections;");
  const maxConnections = maxConnectionsQuery.rows[0].max_connections;

  response.status(200).json({
    updated_at: updatedAt,
    max_connections: maxConnections,
  });
}

export default status;
