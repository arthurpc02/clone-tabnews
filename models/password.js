import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfRounds();

  const passwordWithPepper = addPepper(password);
  console.log("password with pepper:", passwordWithPepper);
  return await bcryptjs.hash(passwordWithPepper, rounds);
}

function getNumberOfRounds() {
  let rounds = 1;

  if (process.env.NODE_ENV === "production") {
    rounds = 14;
  }

  return rounds;
}

function addPepper(password) {
  const pepper = process.env.PASSWORD_PEPPER;

  if (!pepper) {
    throw new Error("PASSWORD_PEPPER is not defined");
  }

  return password + pepper;
}

async function compare(providedPassword, storedPassword) {
  const providedPasswordWithPepper = addPepper(providedPassword);
  // console.log("ProvidedPassword with pepper:", providedPasswordWithPepper);
  return await bcryptjs.compare(providedPasswordWithPepper, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
