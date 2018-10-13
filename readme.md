## @naturalcycles/shared-module

> Set of opinionated configuration files and tools for common project needs, to be shared between all modules. Enforces conventions between projects.

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![](https://circleci.com/gh/NaturalCycles/SharedModule.svg?style=shield&circle-token=cbb20b471eb9c1d5ed975e28c2a79a45671d78ea)](https://circleci.com/gh/NaturalCycles/SharedModule)

## Conventions

Primary language: TypeScript (`*.ts`).

All files are linted and _prettified_ upon commit (using `husky`, `lint-staged` and `prettier`).

### Folder structure

- `/dist` target dir to put compiled files into (`*.js` and additional files like `*.json`)
- `/src` for all source files
- `/src/scripts` for all non-production source files / scripts.
- `/src/test` for generic test-related files and utilities, integration tests.
- `/src/test/mock`
- `/src/test/integration` for integration tests (unit tests should be placed next to the file)
- `/src/@linked`
- `/src/typings`
- `/src/environments`

### Yarn commands

These commands are available to be called as `yarn <command>`, because they are exposed as `npm scripts` in
`node_modules/.bin/`.

In alphabetic order:

- `bt`: shortcut for "build and test"
- `build`: does `tsc` (typescript compilation) into `dist`
- `build-copy`: copies _additional files_ into `dist` folder (e.g `*.json`)
- `build-tsc`: by default just runs `tsc`, but extendable in target project
- `clean-dist`: cleans up `dist` folder
- `init-from-shared-module`: copied config files from `shared-module/cfg/init` to the project
- `prettier-all`: runs Prettier as we want it: first `prettier` on needed paths, then `tslint` on top of it
- `prettier-do`: runs just Prettier on needed paths
- `test`: alias for `jest`
- `test-ci`: runs test in CI environment, with coverage
- `test-compile`: runs `tsc` on `*.test.ts` files, ensures they can be compiled without error
- `tslint-all`: runs `tslint` on needed paths
- `update-from-shared-module`: copied config files from `shared-module/cfg/overwrite` to the project

## Non-extendable config files

These files cannot be _extended_, so they are instead copied into the target project: first time when seeding the project,
later manually by running `yarn update-from-shared-module`.

These files are **overwritten** in target project every time the mentioned command is run. So, be careful! Solution is to
either extend them in other way (e.g put more `.gitignore` files in subfolders), OR PR to this project, if the need is generic.

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

`@naturalcycles/shared-module` is supposed to be included as `devDependency`.

It has dependencies that will be installed to all modules.

ONLY the dependencies that are:

- **stable**
- safe to automatically update according to semver (e.g `^1.0.0`)

are included.

Examples of what devDeps **cannot** be included:

- `prettier`, because patch versions can change how source code is printed significantly,
  and we want to control how and when to update it.
- `tslint`, for same reasons
- `jest`

Deps that are listed here are _blessed_ and battle-tested.
