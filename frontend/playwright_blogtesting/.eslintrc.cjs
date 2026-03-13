module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:playwright/recommended' // Adds Playwright-specific rules
  ],
  rules: {
    'linebreak-style': 'off',
  },
  env: {
    node: true,
    es2021: true
  },
}