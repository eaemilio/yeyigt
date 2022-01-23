module.exports = {
    bracketSpacing: true,
    singleQuote: true,
    trailingComma: 'all',
    tabWidth: 4,
    printWidth: 120,
    overrides: [
        {
            files: ['**/*.json'],
            options: {
                singleQuote: false,
            },
        },
    ],
};
