module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb',
    'airbnb-typescript'
  ],
  rules: {
    'no-console': 'off',
    'react/jsx-boolean-value': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'react/require-default-props': 'off'
  }
};