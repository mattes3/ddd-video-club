// Bundles a service (src/main.ts of the current directory) into dist/main.js,
// so that it can be run by a plain `oven/bun` image without node_modules.

const result = await Bun.build({
    entrypoints: ['src/main.ts'],
    outdir: 'dist',
    naming: 'main.js',
    target: 'bun',
});

if (!result.success) {
    result.logs.forEach(log => console.error(log));
    process.exit(1);
}
