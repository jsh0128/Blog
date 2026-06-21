module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/database.ts',
  ],
  coverageThreshold: {
    global: { lines: 80 },
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json',
    }],
  },
  // Ensure node_modules are NOT transformed (use native CJS)
  transformIgnorePatterns: ['/node_modules/'],
  // Use ts-jest only for TypeScript files - everything else gets CJS treatment
  moduleDirectories: ['node_modules'],
}
