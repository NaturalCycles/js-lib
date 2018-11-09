## @naturalcycles/js-lib

> Standard library for universal (browser + server) javascript

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![](https://circleci.com/gh/NaturalCycles/js-lib.svg?style=shield&circle-token=cbb20b471eb9c1d5ed975e28c2a79a45671d78ea)](https://circleci.com/gh/NaturalCycles/js-lib)
[![Maintainability](https://api.codeclimate.com/v1/badges/c2dc8d53bd79f79b1d8b/maintainability)](https://codeclimate.com/github/NaturalCycles/js-lib/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c2dc8d53bd79f79b1d8b/test_coverage)](https://codeclimate.com/github/NaturalCycles/js-lib/test_coverage)

# Features

- Decorators
  - `memo`, `memoCache`
- Error
  - `AppError`
- Utils
  - `objectSharedUtil`
  - `randomSharedUtil`
  - `scriptSharedUtil`
  - `stringSharedUtil`
- Services
  - `sentryService`
- Testing
  - `testSharedUtil`
- `types`

  - `StringMap`
  - `PromiseMap`

- ... there's more...

# What should go in this lib

- Only **universal** code that works equally good in the browser and on the server. Otherwise - there are other libs specifically for browser and node.
- Only battle-tested code with solid proven APIs that are not supposed to change.
- Only fully unit-tested code with coverage very close to 100%. All the branches should absolutely be tested.
- Only generic and broad purpose functions, no domain or project-specific code.
- Library- and framework-agnostic, only based on standard JS or TypeScript apis. There are few exceptions for extremely popular dependencies, that will go as `peerDependencies` in this project, in order for the consuming project to have control over the version of each dependency (in their `yarn.lock`).

# Packaging

Written in Typescript.

Transpiled to Javascript with es2017 as target (can be reviewed to be repackaged as es2015 if needed). Uses `commonjs` module system (to be reviewed).

Exported in `dist` folder, together with `*.dt` (to be checked if `*.js.map` is needed too or not).

Versioned as `1.0.<CircleCI_IncrementalBuildNumber>`, each commit in `master` branch is automatically published with incremented version.

`master` is production branch.
