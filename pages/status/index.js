import useSWR from "swr";
import styles from "./status.module.css";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    dedupingInterval: 2000, // avoids multiple requests to the same endpoint.
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <div>
      Última atualização:{" "}
      <span className={styles.highlight}>{updatedAtText}</span>
    </div>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let postgres_version;
  let max_connections;
  let active_connections;

  if (!isLoading && data) {
    postgres_version = data.dependencies.database.postgres_version;
    max_connections = data.dependencies.database.max_connections;
    active_connections = data.dependencies.database.active_connections;
  }

  return (
    <div>
      <h2>Database Status</h2>
      <ul>
        <li>
          Postgres version:
          <span className={styles.highlight}>{postgres_version}</span>
        </li>
        <li>
          Limite de conexões:
          <span class={styles.highlight}>{max_connections}</span>
        </li>
        <li>
          Conexões ativas:
          <span class={styles.highlight}>{active_connections}</span>
        </li>
      </ul>
    </div>
  );
}
