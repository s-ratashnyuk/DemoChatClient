/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  "moduleNameMapper": {
    "\\.(less)$": "identity-obj-proxy"
  },
  "setupFilesAfterEnv": [
    "<rootDir>/src/tests/setup.ts"
  ]
};