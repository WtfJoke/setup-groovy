[![CI](https://github.com/WtfJoke/setup-groovy/actions/workflows/test.yml/badge.svg)](https://github.com/WtfJoke/setup-groovy/actions/workflows/test.yml)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=WtfJoke_setup-groovy&metric=security_rating)](https://sonarcloud.io/dashboard?id=WtfJoke_setup-groovy)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=WtfJoke_setup-groovy&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=WtfJoke_setup-groovy)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=WtfJoke_setup-groovy&metric=bugs)](https://sonarcloud.io/dashboard?id=WtfJoke_setup-groovy)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=WtfJoke_setup-groovy&metric=code_smells)](https://sonarcloud.io/dashboard?id=WtfJoke_setup-groovy)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=WtfJoke_setup-groovy&metric=sqale_index)](https://sonarcloud.io/dashboard?id=WtfJoke_setup-groovy)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=WtfJoke_setup-groovy&metric=ncloc)](https://sonarcloud.io/dashboard?id=WtfJoke_setup-groovy)

The `wtfjoke/setup-groovy` action is a JavaScript action that sets up [Apache Groovy](https://groovy-lang.org/) in your GitHub Actions workflow. by:

- Downloading a requested version of Groovy and adding it to the `PATH`.

# 🔧 Usage

See [action.yml](action.yml)

This action can be run on `ubuntu-latest`, `windows-latest`, and `macos-latest` GitHub Actions runners.

```yml
steps:
  - uses: wtfjoke/setup-groovy@v1
    with:
      groovy-version: '4.x'
  - run: groovy --version
```

## 📊 Supported version syntax

If there is a specific version of Groovy that you need and you don't want to worry about any potential breaking changes due to patch updates (going from `4.0.8` to `4.0.9` for example), you should specify the **exact major, minor, and patch version** (such as `4.0.9`):

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: wtfjoke/setup-groovy@v1
    with:
      groovy-version: '4.0.9'
  - run: groovy HelloWorld.groovy
```

You can specify **only a major and minor version** if you are okay with the most recent patch version being used:

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: wtfjoke/setup-groovy@v1
    with:
      groovy-version: '4.0'
  - run: groovy HelloWorld.groovy
```

You can also use ranges that are specified in [semver](https://github.com/npm/node-semver#ranges), for example a [hypen-range](https://github.com/npm/node-semver#advanced-range-syntax):

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: wtfjoke/setup-groovy@v1
    with:
      groovy-version: '>=3.x <4.0.0'
  - run: groovy HelloWorld.groovy
```
