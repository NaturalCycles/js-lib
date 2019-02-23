## [3.1.1](https://github.com/NaturalCycles/shared-module/compare/v3.1.0...v3.1.1) (2019-02-23)


### Bug Fixes

* `yarn test-ci` to set JEST_SILENT=1 ([43314d8](https://github.com/NaturalCycles/shared-module/commit/43314d8))

# [3.1.0](https://github.com/NaturalCycles/shared-module/compare/v3.0.0...v3.1.0) (2019-02-23)


### Features

* yarn test will set process.env.JEST_SILENT ([d7be234](https://github.com/NaturalCycles/shared-module/commit/d7be234))

# [3.0.0](https://github.com/NaturalCycles/shared-module/compare/v2.4.0...v3.0.0) (2019-02-23)


### Features

* support jest24 ([c733017](https://github.com/NaturalCycles/shared-module/commit/c733017))


### BREAKING CHANGES

* requires jest24 (change in jest.config.js)
has jest23.config.js for compatibility

# [2.4.0](https://github.com/NaturalCycles/shared-module/compare/v2.3.0...v2.4.0) (2019-02-23)


### Features

* `yarn test` auto `--silent` if all tests are run ([2dc66ae](https://github.com/NaturalCycles/shared-module/commit/2dc66ae))

# [2.3.0](https://github.com/NaturalCycles/shared-module/compare/v2.2.1...v2.3.0) (2019-02-19)


### Features

* add test.tsx unit test match pattern ([#5](https://github.com/NaturalCycles/shared-module/issues/5)) ([5ee42f7](https://github.com/NaturalCycles/shared-module/commit/5ee42f7))

## [2.2.1](https://github.com/NaturalCycles/shared-module/compare/v2.2.0...v2.2.1) (2019-02-18)


### Bug Fixes

* publish `scripts/tsconfig.json` ([ccfc45c](https://github.com/NaturalCycles/shared-module/commit/ccfc45c))

# [2.2.0](https://github.com/NaturalCycles/shared-module/compare/v2.1.1...v2.2.0) (2019-02-18)


### Bug Fixes

* add *.tsx to tslint ([96018ec](https://github.com/NaturalCycles/shared-module/commit/96018ec))


### Features

* gitignore /secret ([0959185](https://github.com/NaturalCycles/shared-module/commit/0959185))

## [2.1.1](https://github.com/NaturalCycles/shared-module/compare/v2.1.0...v2.1.1) (2019-02-16)


### Bug Fixes

* revert to using yarn.lock in libs ([3cd6180](https://github.com/NaturalCycles/shared-module/commit/3cd6180))

# [2.1.0](https://github.com/NaturalCycles/shared-module/compare/v2.0.0...v2.1.0) (2019-02-16)


### Features

* yarn tsn-script (see readme) ([a68e426](https://github.com/NaturalCycles/shared-module/commit/a68e426))

# [2.0.0](https://github.com/NaturalCycles/shared-module/compare/v1.8.0...v2.0.0) (2019-02-15)


### Features

* drop support for `./src/scripts` ([8db0562](https://github.com/NaturalCycles/shared-module/commit/8db0562))


### BREAKING CHANGES

* - use `./scripts` instead of `./src/scripts`

# [1.8.0](https://github.com/NaturalCycles/shared-module/compare/v1.7.0...v1.8.0) (2019-02-09)


### Bug Fixes

* gitignore yarn.lock (because it's a library) ([ce26a6f](https://github.com/NaturalCycles/shared-module/commit/ce26a6f))
* remove yarn.lock from repo, because it's a library ([84fdd6a](https://github.com/NaturalCycles/shared-module/commit/84fdd6a))


### Features

* remove `yarn release` functionality ([1000a38](https://github.com/NaturalCycles/shared-module/commit/1000a38))

# [1.7.0](https://github.com/NaturalCycles/shared-module/compare/v1.6.0...v1.7.0) (2019-01-26)


### Features

* experimentally move /src/scripts to /scripts ([0f799e4](https://github.com/NaturalCycles/shared-module/commit/0f799e4))

# [1.6.0](https://github.com/NaturalCycles/shared-module/compare/v1.5.0...v1.6.0) (2019-01-10)


### Features

* jest ignore `/src/test/integration/` by default ([795518f](https://github.com/NaturalCycles/shared-module/commit/795518f))

# [1.5.0](https://github.com/NaturalCycles/shared-module/compare/v1.4.5...v1.5.0) (2018-12-18)


### Bug Fixes

* remove --silent from jest ([d509de4](https://github.com/NaturalCycles/shared-module/commit/d509de4))
* yarn upgrade ([44fa09c](https://github.com/NaturalCycles/shared-module/commit/44fa09c))


### Features

* gitignore more ([ca52a51](https://github.com/NaturalCycles/shared-module/commit/ca52a51))

## [1.4.5](https://github.com/NaturalCycles/shared-module/compare/v1.4.4...v1.4.5) (2018-11-30)


### Bug Fixes

* jest obsolete snapshots ([79a684c](https://github.com/NaturalCycles/shared-module/commit/79a684c))

## [1.4.4](https://github.com/NaturalCycles/shared-module/compare/v1.4.3...v1.4.4) (2018-11-29)


### Bug Fixes

* prettier in git hook ([9ff48c1](https://github.com/NaturalCycles/shared-module/commit/9ff48c1))

## [1.4.3](https://github.com/NaturalCycles/shared-module/compare/v1.4.2...v1.4.3) (2018-11-16)


### Bug Fixes

* build-copy copy more ([d93b98e](https://github.com/NaturalCycles/shared-module/commit/d93b98e))

## [1.4.2](https://github.com/NaturalCycles/shared-module/compare/v1.4.1...v1.4.2) (2018-11-10)


### Bug Fixes

* changes ([89ed81a](https://github.com/NaturalCycles/shared-module/commit/89ed81a))

## [1.4.1](https://github.com/NaturalCycles/shared-module/compare/v1.4.0...v1.4.1) (2018-11-09)


### Bug Fixes

* don't export semantic-release ([276cda3](https://github.com/NaturalCycles/shared-module/commit/276cda3))

# [1.4.0](https://github.com/NaturalCycles/shared-module/compare/v1.3.1...v1.4.0) (2018-11-09)


### Features

* jest.config with transformIgnorePatterns ([96b83a4](https://github.com/NaturalCycles/shared-module/commit/96b83a4))

## [1.3.1](https://github.com/NaturalCycles/shared-module/compare/v1.3.0...v1.3.1) (2018-11-09)


### Bug Fixes

* unignore /src/scripts ([ed7944a](https://github.com/NaturalCycles/shared-module/commit/ed7944a))

# [1.3.0](https://github.com/NaturalCycles/shared-module/compare/v1.2.4...v1.3.0) (2018-11-07)


### Bug Fixes

* fix prettier.util.test ([900e36c](https://github.com/NaturalCycles/shared-module/commit/900e36c))
* fix test again ([8d0b7ed](https://github.com/NaturalCycles/shared-module/commit/8d0b7ed))


### Features

* improvements ([cd2f34e](https://github.com/NaturalCycles/shared-module/commit/cd2f34e))

## [1.2.4](https://github.com/NaturalCycles/shared-module/compare/v1.2.3...v1.2.4) (2018-11-06)


### Bug Fixes

* **deps:** update dependency [@types](https://github.com/types)/fs-extra to v5.0.4 ([19da02c](https://github.com/NaturalCycles/shared-module/commit/19da02c))

## [1.2.3](https://github.com/NaturalCycles/shared-module/compare/v1.2.2...v1.2.3) (2018-11-04)


### Bug Fixes

* various ([8ef1e82](https://github.com/NaturalCycles/shared-module/commit/8ef1e82))

## [1.2.2](https://github.com/NaturalCycles/shared-module/compare/v1.2.1...v1.2.2) (2018-11-04)


### Bug Fixes

* try-catch `yarn release` ([736fbb7](https://github.com/NaturalCycles/shared-module/commit/736fbb7))

## [1.2.1](https://github.com/NaturalCycles/shared-module/compare/v1.2.0...v1.2.1) (2018-11-04)


### Bug Fixes

* husky.config.js ([2e2ade8](https://github.com/NaturalCycles/shared-module/commit/2e2ade8))

# [1.2.0](https://github.com/NaturalCycles/shared-module/compare/v1.1.2...v1.2.0) (2018-11-04)


### Features

* `yarn release` with default config ([ab7abf4](https://github.com/NaturalCycles/shared-module/commit/ab7abf4))

## [1.1.2](https://github.com/NaturalCycles/shared-module/compare/v1.1.1...v1.1.2) (2018-11-04)


### Bug Fixes

* expose `release.config.js` ([6e03cf2](https://github.com/NaturalCycles/shared-module/commit/6e03cf2))

## [1.1.1](https://github.com/NaturalCycles/shared-module/compare/v1.1.0...v1.1.1) (2018-11-04)


### Bug Fixes

* added missing dep ([7704de6](https://github.com/NaturalCycles/shared-module/commit/7704de6))
* adding CHANGELOG.md ([6260421](https://github.com/NaturalCycles/shared-module/commit/6260421))
