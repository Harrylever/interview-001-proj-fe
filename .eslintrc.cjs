module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'airbnb-typescript'],
  overrides: [
    {
      extends: [],
      files: ['*.ts', '*.tsx'],
    },
  ],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': [0],
    'no-console': 'off'
  },
};

