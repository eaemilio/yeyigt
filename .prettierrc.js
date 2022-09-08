module.exports = {
  bracketSpacing: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 100,
  overrides: [
    {
      files: ['**/*.json'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
