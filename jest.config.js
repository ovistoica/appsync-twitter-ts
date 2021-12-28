/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/test_cases/**/*.(js|ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/'],
}
