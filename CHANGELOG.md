# [2.0.0](https://github.com/myth-tools/myth-tools/compare/v1.5.0...v2.0.0) (2022-01-09)


* feat!: bump version as previous commit wasn't detected ([3336218](https://github.com/myth-tools/myth-tools/commit/33362189da10c28c093696ce624d269211ee0657))


### BREAKING CHANGES

* major project refactor

This pull request has grown larger then originally anticipated and should have been multiple pull requests, however this refactors the entire project structure, implements version, blueprint extraction and compilation for the explorer.

The explorer will assists in development by making it easy to track down entities and piece the structure of the planner together, it is not a deployable asset due to the blueprints coming in at 180MB. The hosting of this would not be feasible and is not required, this will simply be served locally where the file downloads in a matter of milliseconds as it's running off the file system.

If users wish to explore the blueprints then the project can be cloned, built and run locally themself.

# [1.5.0](https://github.com/myth-tools/myth-tools/compare/v1.4.1...v1.5.0) (2022-01-03)


### Features

* compile blueprints into a usable format for the browser ([#21](https://github.com/myth-tools/myth-tools/issues/21)) ([8230772](https://github.com/myth-tools/myth-tools/commit/82307722c6e98d8305ac646a640054805ae4bf7b))

## [1.4.1](https://github.com/myth-tools/myth-tools/compare/v1.4.0...v1.4.1) (2021-12-30)


### Bug Fixes

* bump version to trigger deploy ([77373ad](https://github.com/myth-tools/myth-tools/commit/77373ad6f09d7fb622c761fd657458ff59b3a9be))

# [1.4.0](https://github.com/myth-tools/myth-tools/compare/v1.3.0...v1.4.0) (2021-12-30)


### Features

* extract blueprints and version info ([#18](https://github.com/myth-tools/myth-tools/issues/18)) ([410d9f1](https://github.com/myth-tools/myth-tools/commit/410d9f13dd871c4f77e1a7fa06e03a2490af47e0))

# [1.3.0](https://github.com/myth-tools/myth-tools/compare/v1.2.0...v1.3.0) (2021-12-29)


### Features

* **planner:** add angular material and basic style configuration ([#14](https://github.com/myth-tools/myth-tools/issues/14)) ([65f8be9](https://github.com/myth-tools/myth-tools/commit/65f8be9d78e83efa0feed0063b694f1c666560b6))

# [1.2.0](https://github.com/myth-tools/myth-tools/compare/v1.1.0...v1.2.0) (2021-12-28)


### Features

* add lib to generate dynamic links ([#12](https://github.com/myth-tools/myth-tools/issues/12)) ([3c47e51](https://github.com/myth-tools/myth-tools/commit/3c47e5167a997e49136b627834d91359b44a993e))

# [1.1.0](https://github.com/myth-tools/myth-tools/compare/v1.0.0...v1.1.0) (2021-12-28)


### Features

* deploy to custom domain ([#9](https://github.com/myth-tools/myth-tools/issues/9)) ([087b89d](https://github.com/myth-tools/myth-tools/commit/087b89d15a53b175419028d8f0b5f1df1723753e))


# 1.0.0 (2021-12-27)


### Features

* init firebase dynamic link ([3a63035](https://github.com/myth-tools/myth-tools/commit/3a63035e6bf0211eb05dedd4c3881acda70392f6))
