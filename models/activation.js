import email from "infra/email.js";
import database from "infra/database.js";
import webserver from "infra/webserver.js";
import user from "models/user.js";
import { ForbiddenError, ValidationError } from "infra/errors.js";

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
            id = $1 
            AND expires_at>NOW()
            AND used_at IS NULL
          LIMIT
            1
        ;`,
      values: [id],
    });
    return results.rows[0];
  }
}

async function findOneById(id) {
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
            id = $1 
          LIMIT
            1
        ;`,
      values: [id],
    });
    return results.rows[0];
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

async function activateUserByUserId(userId) {
  const activatedUser = await user.setFeatures(userId, [
    "create:session",
    "read:session",
  ]);
  return activatedUser;
}

async function markTokenAsUsed(tokenId) {
  const result = await runUpdateQuery(tokenId);

  return result;
  async function runUpdateQuery(tokenId) {
    const results = await database.query({
      text: `
      UPDATE
        user_activation_tokens
      SET
        used_at = NOW()
      WHERE
        id = $1
      RETURNING
        *
      ;`,
      values: [tokenId],
    });

    if (!results.rows[0]) {
      throw new Error("no token found");
    }

    return results.rows[0];
  }
}

async function activate(tokenId) {
  const tokenObject = await findOneValidById(tokenId);

  if (!tokenObject) {
    throw new ForbiddenError({
      message: "Nenhum token válido encontrado.",
      action: "O token já está expirado ou já foi utilizado.",
    });
  }

  console.log("found valid token");

  const updatedToken = await markTokenAsUsed(tokenId);
  await activation.activateUserByUserId(tokenObject.user_id);
  return updatedToken;
}

const activation = {
  create,
  sendEmailToUser,
  findOneByUserId,
  findOneValidById,
  findOneById,
  activate,
  activateUserByUserId,
};

export default activation;
