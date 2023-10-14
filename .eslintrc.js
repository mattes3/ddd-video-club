module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["xo"],
    overrides: [
        {
            extends: ["xo-typescript", "prettier"],
            files: ["*.ts", "*.tsx", "*.d.ts"],
            rules: {
                "@typescript-eslint/object-curly-spacing": "off",
                "@typescript-eslint/naming-convention": "off",
                "@typescript-eslint/no-unsafe-assignment": "off",
                "@typescript-eslint/comma-dangle": "off",
                "@typescript-eslint/brace-style": "off",
                "@typescript-eslint/ban-types": "off",
                "@typescript-eslint/consistent-type-definitions": "off",
                "@typescript-eslint/no-empty-function": "off",
                "@typescript-eslint/no-unsafe-declaration-merging": "off",
                "capitalized-comments": "off",
                "padded-blocks": "off",
                "no-empty-static-block": "off",
                "no-new-native-nonconstructor": "off",
            },
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                tsconfigRootDir: `${__dirname}/packages`,
                project: ["database/tsconfig.json", "movies/tsconfig.json"],
            },
        },
    ],
    rules: {
        "no-console": "off",
        indent: "off",
        "jsx-quotes": "off",
        "new-cap": "off",
    },
};
