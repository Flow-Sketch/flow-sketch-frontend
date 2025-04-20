/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!nanoid)'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.svg$': 'jest-svg-transformer',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.test.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
};

export default config;
