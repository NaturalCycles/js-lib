# @naturalcycles/shared-module

Provides a list of opinionated configuration files and tools for common project needs, to be shared between all modules.

Enforces conventions between projects.

## Conventions

Primary language: TypeScript (`*.ts`).

All files are linted and *prettified* upon commit (using `husky`, `lint-staged` and `prettier`).


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
- `build-copy`: copies *additional files* into `dist` folder (e.g `*.json`)
- `build-tsc`: by default just runs `tsc`, but extendable in target project
- `clean-dist`: cleans up `dist` folder
- `prettier-all`: runs Prettier as we want it: first `prettier` on needed paths, then `tslint` on top of it
- `prettier-do`: runs just Prettier on needed paths
- `test`: alias for `jest`
- `test-ci`: runs test in CI environment, with coverage
- `test-compile`: runs `tsc` on `*.test.ts` files, ensures they can be compiled without error
- `tslint-all`: runs `tslint` on needed paths


## Non-extendable config files

These files cannot be *extended*, so they are instead copied into the target project: first time when seeding the project,
later manually by running `yarn update-from-shared-module`.

These files are **overwritten** in target project every time the mentioned command is run. So, be careful! Solution is to
either extend them in other way (e.g put more `.gitignore` files in subfolders), OR PR to this project, if the need is generic.

- `.editorconfig`
- `.gitignore`
- `.codeclimate.yml` (with some work it can be made extendable later)


## Extendable config files

These files are meant to be extended in target project, so act as *recommended defaults*.

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

Deps that are listed here are *blessed* and battle-tested.
