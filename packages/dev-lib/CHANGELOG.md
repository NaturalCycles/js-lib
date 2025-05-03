See [Github Releases](https://github.com/NaturalCycles/dev-lib/releases)

# 13.0 Release notes

`dev-lib` started to expose `dev-lib` command that can be executed like `yarn dev-lib`.

It can work in 2 modes: CLI and interactive.

CLI mode is for command execution, e.g `yarn dev-lib lint` will run all linters, what previously was
`yarn lint-all`.

Interactive mode is for human interactive execution and exploration of available commands.
`yarn dev-lib` gives you an interactive prompt to select one of available commands.

These deprecated commands were removed:

- test-ci
- test-integration-ci
- test-manual

These commands are no longer exposed as commands:

- build-copy

These commands stay as shortcuts/aliases (they kind of make sense there, as they're yarn-related):

- yarn up
- yarn upnc

`build-prod` now falls back to `tsconfig.json` if `tsconfig.prod.json` is absent.

## Migration guide

```
# build commands

yarn bt                 => yarn dev-lib bt
yarn btl                => yarn dev-lib lbt # lbt reflects the order: lint-build-test
yarn build              => gone, no replacement
yarn build-copy         => yarn dev-lib build-copy
yarn tsc-prod, tsc-scripts => gone, no replacement
yarn build-prod         => yarn dev-lib build
yarn build-prod-esm-cjs => yarn dev-lib build-esm-cjs

# lint commands

yarn commitlint-def     => yarn dev-lib commitlint
yarn lint-staged-def    => yarn dev-lib lint-staged
yarn lint-all           => yarn dev-lib lint
yarn eslint-all         => yarn dev-lib eslint
yarn prettier-all       => yarn dev-lib prettier
yarn stylelint-all      => yarn dev-lib stylelint

# test commands

yarn test-ci, test-integration-ci, test-manual => gone, no replacement
yarn test               => yarn dev-lib test
yarn test-integration   => yarn dev-lib test-integration
yarn test-leaks         => yarn dev-lib test-leaks

# other commands
init-from-dev-lib, update-from-dev-lib => temporary gone, to be re-introduced later

```
