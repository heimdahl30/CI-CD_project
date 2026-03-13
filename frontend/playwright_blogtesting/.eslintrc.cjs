module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:playwright/recommended' // Adds Playwright-specific rules
  ],
  env: {
    node: true,
    es2021: true 
  },
  rules: {
    // Senior tip: This prevents the #1 cause of hanging tests
    'playwright/no-floating-promises': 'error' 
  }
}