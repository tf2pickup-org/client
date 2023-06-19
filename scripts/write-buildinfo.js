const packageJson = require('../package.json');

const version = packageJson.version;

process.stdout.write(JSON.stringify({ version }));
