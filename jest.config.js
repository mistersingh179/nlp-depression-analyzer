/**
 * Jest configuration for TypeScript project
 */
module.exports = {
  // Use ts-jest preset to handle TypeScript files
  preset: 'ts-jest',
  // Test environment that will be used for testing
  testEnvironment: 'node',
  // Look for test files in the src directory
  roots: ['<rootDir>/src'],
  // Match test specification files
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  // File extensions to be handled
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
};