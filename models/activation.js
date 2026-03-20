import email from "infra/email.js";
import database from "infra/database.js";
import webserver from "infra/webserver.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 Minutos

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO
          user_activation_tokens(user_id, expires_at)
        VALUES
          ($1, $2)
        RETURNING
          *   
      ;`,
      values: [userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function findOneByUserId(userId) {
  const newToken = await runSelectQuery(userId);
  return newToken;

  async function runSelectQuery(userId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          user_activation_tokens
        WHERE
          user_id = $1
        LIMIT
          1
      ;`,
      values: [userId],
    });
    return results.rows[0];
  }
}

async function findOneValidById(id) {
  const newToken = await runSelectQuery(id);

  return newToken;
  async function runSelectQuery(id) {
    const results = await database.query({
      text: `
          SELECT
            *
          FROM
            user_activation_tokens
          WHERE
            id = $1 and expires_at>NOW()
          LIMIT
            1
        ;`,
      values: [id],
    });
    return results.rows[0];
  }
}

function extractTokenFromEmail(email) {
  const re = /https*:\/\/.*cadastro\/ativar\/(.*)\s/;

  const myArray = re.exec(email.text);
  if (!myArray) {
    throw new Error("No Token found on the Email");
  } else {
    const foundToken = myArray[1];
    return foundToken;
  }
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "FinTab <contato@fintab.com.br>",
    to: user.email,
    subject: "Ative seu cadastro no FinTab!",
    text: `${user.username}, clique no link abaixo para ativar seu cadastro no FinTab:
    
${webserver.origin}/cadastro/ativar/${activationToken.id}

Atenciosamente,

Equipe FinTab.
    `,
  });
}

const activation = {
  create,
  sendEmailToUser,
  findOneByUserId,
  extractTokenFromEmail,
  findOneValidById,
};

export default activation;
