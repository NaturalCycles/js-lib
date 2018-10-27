/**
 * Default config for `lint-staged`.
 * Extendable.
 */

module.exports = {
  linters: {
    // For *.ts files we run first Prettier, then TSLint
    './src/**/*.ts': ['prettier --write', 'tslint -p tsconfig.json -t stylish --fix', 'git add'],

    // For all other files we run only Prettier (because e.g TSLint screws *.scss files)
    // Everything inside `/src`
    './{src,doc,.circleci}/**/*.{css,scss,json,md,graphql,yml,yaml}': [
      'prettier --write',
      'git add',
    ],

    // Files in root dir
    './*.{js,json,md,yml,yaml}': ['prettier --write', 'git add'],
  },

  ignore: ['./src/scripts/**/*'],
}
