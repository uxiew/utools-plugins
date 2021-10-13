module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es6: true
  },

  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'eslint:recommended',
    '@vue/typescript',
    '@vue/prettier'
  ],

  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },

  rules: {
    'prettier/prettier': [
      1,
      {
        semi: true,
        singleQuote: true,
        parser: 'flow'
      }
    ],
    'vue/no-v-html': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
};
