## @naturalcycles/dev-lib

> Set of opinionated configuration files and tools for common project needs, to be shared between
> all modules. Enforces conventions between projects.

[![npm](https://img.shields.io/npm/v/@naturalcycles/dev-lib/latest.svg)](https://www.npmjs.com/package/@naturalcycles/dev-lib)
[![install size](https://packagephobia.now.sh/badge?p=@naturalcycles/dev-lib)](https://packagephobia.now.sh/result?p=@naturalcycles/dev-lib)
[![](https://circleci.com/gh/NaturalCycles/dev-lib.svg?style=shield&circle-token=cbb20b471eb9c1d5ed975e28c2a79a45671d78ea)](https://circleci.com/gh/NaturalCycles/dev-lib)
[![Maintainability](https://api.codeclimate.com/v1/badges/2f796927dce4bc0db5f6/maintainability)](https://codeclimate.com/github/NaturalCycles/dev-lib/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2f796927dce4bc0db5f6/test_coverage)](https://codeclimate.com/github/NaturalCycles/dev-lib/test_coverage)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Known Vulnerabilities](https://snyk.io/package/npm/snyk/badge.svg)](https://snyk.io/package/npm/@naturalcycles/dev-lib)

## How to use

Install it:

    yarn add -D @naturalcycles/dev-lib

This unlocks all commands listed below, e.g:

    yarn test
    yarn lint-all

By default it uses default configs for Prettier and TSLint that are included in this package (for
convenience). You can override them by putting your own `prettier.config.js` / `tslint.json` in root
folder of your project.

## Conventions

Primary language: TypeScript (`*.ts`).

All files are linted and _prettified_ upon commit (using `husky`, `lint-staged` and `prettier`).

### Folder structure

- `/dist` target dir to put compiled files into (`*.js` and additional files like `*.json`)
- `/dist-cjs` target for CommonJS files
- `/dist-esm` target for ES Modules
- `/src` for all source files
- `/scripts` for all non-production source files / scripts.
- `/src/test` for generic test-related files and utilities, integration tests.
- `/src/test/mock`
- `/src/test/integration` for integration tests (unit tests should be placed next to the file)
- `/src/@types`
- `/src/env`
- `/coverage`
- `/tmp`
  - `/jest/unit.xml`
  - `/jest/integration.xml`
  - `/coverage-integration`

### Yarn commands

These commands are available to be called as `yarn <command>`, because they are exposed as
`npm scripts` in `node_modules/.bin/`.

#### Build commands

- `tsc-prod`: does `tsc -p tsconfig.prod.ts`
- `tsc-scripts`: does `tsc -p ./scripts/tsconfig.ts --noEmit` (type-checking for `./scripts`)

- `build`: "Development build". Checks that "everything compiles". Does
  `del ./dist && tsc && tsc-scripts`
- `bt`: "Build & Test". Does `del ./dist && tsc && tsc-scripts && test`

- `build-copy`: copies _additional files_ into `dist` folder (e.g `*.json`)
- `build-prod`: "Production build". Does `del ./dist && build-copy && tsc-prod`
- `build-prod-esm-cjs`: "Production build" for browser-lib, will produce CJS output in `./dist` and
  ESM output in `./dist-esm`. Will use `./tsconfig.{cjs|esm}.prod.json` if exists, otherwise
  `tsconfig.prod.json`, which allows to override e.g compilation target.

#### Test commands

All test commands set `TZ=UTC`. You can override it by providing `TZ` env variable **before**
running a test command.

- `test`: alias for `jest`. Automatically detects `full-icu` module presense, adds
  `NODE_ICU_DATA=${fullICUPath}` if needed. Automatically adds `--silent` (and `JEST_SILENT` env
  var) if all tests are run. Adds `APP_ENV=test` env var (for all runs except integration).
- `test-ci`: runs test in CI environment, with coverage. Includes fix for "CircleCI out of memory
  issue"
- `test-integration`: runs Jest with `jest.integration-test.config.js` config. Which will only run
  tests from `./src/test/integration` folder.
- `test-integration-ci`
- `test-leaks`: runs Jest with `--logHeapUsage --detectOpenHandles --detectLeaks` (requires `weak`
  module to be installed in target project).

For unit tests (`yarn test`) these `setupFilesAfterEnv` will be used (if found) in that order:

- `<rootDir>/src/test/setupJest.ts`
- `<rootDir>/src/test/setupJest.unit.ts`

For integration tests (`yarn test-integration`) these `setupFilesAfterEnv` will be used (if found)
in that order:

- `<rootDir>/src/test/setupJest.ts`
- `<rootDir>/src/test/setupJest.integration.ts`

`yarn test` runs tests in alphabetic order by default (internally it points `--testSequencer` to a
pre-defined sequencer file that sorts all filenames alphabetically). Set `JEST_NO_ALPHABETIC` env
variable to disable it.

#### Lint commands

- `lint-all`: runs Prettier as we want it: first `tslint` on needed paths, then `prettier` on top of
  it.

  - `--commitOnChanges` will commit lint-modified changes and push them
  - `--failOnChanges` will exit with status 1 in the end (will fail the command)

- `tslint-all`: runs `tslint` on needed paths
- `prettier-all`: runs just Prettier on needed paths
- `lint-circleci`: fails if `.circleci/config.yml` is invalid
  ([CircleCI CLI](https://circleci.com/docs/2.0/local-cli/) must be installed before)

#### Other commands

- `init-from-dev-lib`: copy config files from `dev-lib/cfg/init` to the project
- `update-from-dev-lib`: copy config files from `dev-lib/cfg/overwrite` to the project
- `generate-build-info`: generate `buildInfo.json`
  - `--dir <someDir>` will save it to given dir
  - `--shell` will also generate `buildInfo.sh`
- `json2env`: for specified `.json` file will create `.json.sh` file next to it that will "export"
  all values of json file as environment variables. Will also append \$BASH_ENV (if defined) for
  CircleCI. Example: `yarn json2env someFile.json` will create `someFile.json.sh`
  - `--prefix` will prepend all keys with `prefix` string, e.g `--prefix buildInfo_` will output as
    `buildInfo_key1`, `buildInfo_key2`, etc.
  - `--no-save-env-file` to skip saving `.sh` file
  - `--no-bash-env` to skip adding to `$BASH_ENV`
  - `--no-fail` will not throw error on missing input file
  - `--silent`
  - `--debug`

## Non-extendable config files

These files cannot be _extended_, so they are instead copied into the target project: first time
when seeding the project, later manually by running `yarn update-from-dev-lib`.

These files are **overwritten** in target project every time the mentioned command is run. So, be
careful! Solution is to either extend them in other way (e.g put more `.gitignore` files in
subfolders), OR PR to this project, if the need is generic.

- `.editorconfig`
- `.gitignore`
- `.codeclimate.yml` (with some work it can be made extendable later)

## Extendable config files

These files are meant to be extended in target project, so act as _recommended defaults_.

- `husky.config.js`
- `lint-staged.config.js`
- `prettier.config.js`
- `tslint.json`
- `jest.config.js`

## Dependencies

`@naturalcycles/dev-lib` is supposed to be included as `devDependency`.

It has dependencies that will be installed to all modules.

ONLY the dependencies that are:

- **stable**
- safe to automatically update according to semver (e.g `^1.0.0`)

are included.

Examples of what devDeps **cannot** be included:

- `jest`

Deps that are listed here are _blessed_ and battle-tested.
