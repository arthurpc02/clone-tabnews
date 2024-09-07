// this file uses old commonJS import methods because Jest does not support ESM.
const nextJest = require('next/jest');

const createJestConfig = nextJest();
const jestConfig = createJestConfig({
  moduleDirectories: ['node_modules', "<rootDir>"],
});

console.log("NODE_ENV = " + process.env.NODE_ENV);

module.exports = jestConfig;