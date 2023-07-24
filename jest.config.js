module.exports = {
  ...require('@naturalcycles/dev-lib/cfg/jest.config'),
  // transform: {
  //   // example (experimental):
  //   '^.+\\.ts$': '@naturalcycles/dev-lib/cfg/jest.esbuild.transformer.js',
  // },
  prettierPath: null, // todo: remove when jest has fixed it https://github.com/jestjs/jest/issues/14305
}
