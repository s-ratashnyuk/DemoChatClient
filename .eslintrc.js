module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
 },

  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "no-underscore-dangle": 0,
    "import/prefer-default-export": 0,
    "no-restricted-syntax": [ "error", "ForInStatement", "LabeledStatement", "WithStatement" ],
    "arrow-body-style": ["error", "always"],
    "class-methods-use-this": 0,
  },
}