# octoherd-script-get-files

> The easiest way to download files from GitHub.

[![@latest](https://img.shields.io/npm/v/octoherd-script-get-files.svg)](https://www.npmjs.com/package/octoherd-script-get-files)
[![Build Status](https://github.com/stefanbuck/octoherd-script-get-files/workflows/Test/badge.svg)](https://github.com/stefanbuck/octoherd-script-get-files/actions?query=workflow%3ATest+branch%3Amain)

## Usage

Minimal usage

```js
npx octoherd-script-get-files \
  --source README.md \
  --output ./out
```

Pass all options as CLI flags to avoid user prompts

```js
npx octoherd-script-get-files \
  -T ghp_0123456789abcdefghjklmnopqrstuvwxyzA \
  -R "octolinker/*" \
  --source README.md \
  --output ./out
```

## Options

| option | type| description|
| --- | --- | --- |
| `--source` | string | **Required.** File to download. This can also be a Glob see [example](#examples).|
| `--output` | string | **Required.** Specify a path to place the downloaded file or directory (instead of using the current working directory). Directories specified in the path will be created by this command. |
| `--ignore-archived` or `--no-ignore-archived` | boolean | Default `true`. Ignores archive repositories|
| `--ignore-forks` or `--no-ignore-forks` | boolean | Default `true`. Ignores forked repositories|
| `--ignore-public` or `--no-ignore-public` | boolean | Default `false`. Ignores public repositories|
| `--ignore-private` or `--no-ignore-private` | boolean | Default `false`. Ignores private repositories|
| `--octoherd-token`, `-T`| string | A personal access token ([create](https://github.com/settings/tokens/new?scopes=repo)). Script will create one if option is not set|
| `--octoherd-repos`, `-R` | array of strings | One or multiple space-separated repositories in the form of `repo-owner/repo-name`. `repo-owner/*` will find all repositories for one owner. `*` will find all repositories the user has access to. Will prompt for repositories if not set |
| `--octoherd-bypass-confirms` | boolean | Bypass prompts to confirm mutating requests|

## Examples

Download a single file

```js
npx octoherd-script-get-files -R octolinker/octolinker --source=README.md --output=./out
```

Download a single file by full path

```js
npx octoherd-script-get-files -R octolinker/octolinker --source=.github/PULL_REQUEST_TEMPLATE.md --output=./out
```

Download recursively all files with a certain file extension

```js
npx octoherd-script-get-files -R octolinker/octolinker --source='**/*.html' --output=./out
```

Download recursively all files from a specific folder

```js
npx octoherd-script-get-files -R octolinker/octolinker --source='.github/**/*' --output=./out
```

Download everything

```js
npx octoherd-script-get-files -R octolinker/octolinker --source='**/*' --output=./out
```

Don't know how to write Glob? Check out DigitalOcean's amazing [Glob testing tool](https://www.digitalocean.com/community/tools/glob).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## About Octoherd

[@octoherd](https://github.com/octoherd/) is project to help you keep your GitHub repositories in line.

## License

[ISC](LICENSE.md)
