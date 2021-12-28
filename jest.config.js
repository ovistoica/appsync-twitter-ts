// jest.config.js
const {pathsToModuleNameMapper} = require('ts-jest')
const {compilerOptions} = require('./tsconfig.paths.json')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/test_cases/**/*.(js|ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/'],
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl], // <-- This will be set to './src'
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
}
