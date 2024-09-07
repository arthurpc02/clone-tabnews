// this file uses old commonJS import methods because Jest does not support ESM.
const nextJest = require("next/jest");
const dotenv = require("dotenv");

dotenv.config({
  path: '.env.development'
});

const createJestConfig = nextJest({
  dir: ".",
});

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
});

console.log("NODE_ENV = " + process.env.NODE_ENV);
console.log("pg host = " + process.env.POSTGRES_HOST);


module.exports = jestConfig;
