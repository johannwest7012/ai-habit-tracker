module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '.expo/', 'web-build/'],
};
