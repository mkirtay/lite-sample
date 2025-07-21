export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  coverage: true,
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
  },
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '2000'
    }
  }
}; 