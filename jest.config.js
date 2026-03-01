// this file uses old commonJS import methods because Jest does not support ESM.
const nextJest = require("next/jest");
const dotenv = require("dotenv");

dotenv.config({
  path: ".env.development",
});

const createJestConfig = nextJest({
  dir: ".",
});

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000, // 60segundos
});

console.log("NODE_ENV = " + process.env.NODE_ENV);

module.exports = jestConfig;
