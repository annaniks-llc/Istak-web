module.exports = {
  // General settings applied to all files
  bracketSpacing: true, // Adds spaces between brackets, e.g., { foo: bar }
  semi: true, // Use semicolons at the end of statements
  trailingComma: 'all', // Add trailing commas where valid in ES5 (e.g., objects, arrays)
  singleQuote: true, // Use single quotes instead of double quotes
  printWidth: 130, // Wrap lines at 100 characters for better readability
  tabWidth: 2, // Set indentation to 2 spaces
  useTabs: false, // Use spaces instead of tabs

  // File-specific configuration using "overrides"
  overrides: [
    // TypeScript-specific formatting rules
    {
      files: ['*.ts', '*.tsx'], // Match TypeScript files
      options: {
        printWidth: 130, // Maintain consistent line width across TypeScript files
      },
    },
    // JSON-specific formatting rules
    {
      files: '*.json',
      options: {
        printWidth: 80, // Narrower line width for better readability in JSON
      },
    },
  ],

  // Next.js specific rules
  jsxSingleQuote: false, // Use double quotes in JSX for compatibility with HTML conventions

  // Maintain formatting consistency for CSS/SCSS
  overrides: [
    {
      files: ['*.css', '*.scss'],
      options: {
        singleQuote: false, // Use double quotes in CSS for consistency
      },
    },
  ],
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },

      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};
