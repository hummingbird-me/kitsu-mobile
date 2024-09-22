const fixKitsuImports = require('./fix-kitsu-imports');
const plugin = { rules: { 'fix-kitsu-imports': fixKitsuImports } };
module.exports = plugin;
