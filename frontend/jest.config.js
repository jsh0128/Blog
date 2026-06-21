module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^common/(.*)$': '<rootDir>/src/common/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^test-utils$': '<rootDir>/src/test-utils/index.tsx',
    '^styled-components$': '<rootDir>/__mocks__/styled-components.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    'next/image': '<rootDir>/__mocks__/next/image.js',
    'next/link': '<rootDir>/__mocks__/next/link.js',
    'next/router': '<rootDir>/__mocks__/next/router.js',
    'next/navigation': '<rootDir>/__mocks__/next/navigation.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        baseUrl: 'src',
      },
    }],
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/**',
    '!src/test-utils/**',
  ],
  coverageThreshold: {
    global: { lines: 80 },
  },
}
