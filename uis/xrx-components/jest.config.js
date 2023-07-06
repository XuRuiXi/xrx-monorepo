module.exports = {
  testEnvironment: 'jsdom',
  // 收集测试覆盖率
  collectCoverage: true,
  // 测试覆盖率报告输出目录
  coverageDirectory: 'coverage',
  // 收集components目录下的组件测试覆盖率
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}'
  ],
};