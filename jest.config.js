module.exports = {
  silent: false,
  moduleFileExtensions: ['js', 'ts'],
  rootDir: '.',
  testRegex: '[.](spec|test).ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/'],
  moduleNameMapper: {
    '^@config(.*)$': '<rootDir>/src/config/$1',
    '^@interceptors(.*)$': '<rootDir>/src/interceptors/$1',
    '^@filters(.*)$': '<rootDir>/src/filters/$1',
    '^@decorators(.*)$': '<rootDir>/src/decorators/$1',
    '^@modules(.*)$': '<rootDir>/src/modules/$1',
  },
};
