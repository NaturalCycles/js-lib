## @naturalcycles/js-lib

> Standard library for universal (browser + server) javascript

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![](https://circleci.com/gh/@naturalcycles/js-lib.svg?style=shield&circle-token=123)](https://circleci.com/gh/@naturalcycles/js-lib)

# What should go in this lib

- Only __universal__ code that works equally good in the browser and on the server. Otherwise - there are other libs specifically for browser and node.
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

# Features

- Utils
    - `localDateUtil`, `localTimeUtil`
    - `promiseUtil`
    - `jsonUtil`
- Services
    - `sentryService`
- Decorators
    - `memo`, `memoCache`
- ... there's more...

