module.exports = {
    env: {
        node: true,      // Tells ESLint: "This is Node.js, don't worry about 'process'"
        commonjs: true,  // Tells ESLint: "I'm using require()"
        es2021: true
    },

    extends: "eslint:recommended",
    rules: {
        'no-unused-vars': ['error', {
            'argsIgnorePattern': '^_',
            'varsIgnorePattern': '^_',
            'caughtErrorsIgnorePattern': '^_'
        }],
        indent: ["error", 2],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "single"],
        semi: ["error", "never"],
        eqeqeq: "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": ["error", "always"],
        "arrow-spacing": ["error", { "before": true, "after": true }],
        "no-console": 0  // Allows console.log for your logger
    }
}