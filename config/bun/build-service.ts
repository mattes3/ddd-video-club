// Bundles a service (src/main.ts of the current directory) into dist/main.js,
// so that it can be run by a plain `oven/bun` image without node_modules.
// knex lazily requires database drivers that this project does not use.
const unusedKnexDrivers = [
    'mysql',
    'mysql2',
    'tedious',
    'better-sqlite3',
    'sqlite3',
    'mariadb',
    'mariadb/callback',
    'oracledb',
    'pg-native',
    'pg-query-stream',
];

const result = await Bun.build({
    entrypoints: ['src/main.ts'],
    outdir: 'dist',
    naming: 'main.js',
    target: 'bun',
    external: unusedKnexDrivers,
});

if (!result.success) {
    result.logs.forEach(log => console.error(log));
    process.exit(1);
}
