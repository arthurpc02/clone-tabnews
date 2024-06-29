import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "development" ? false : true,
  });

  console.log(client.connectionParameters);

  console.log("node.env: %s", process.env.NODE_ENV);

  try {
    await client.connect();
    const result = await client.query(queryObject);
    // console.log(result);
    return result;
  } catch (err) {
    console.log(`Error during database query: ${err}`);
    throw err;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};
