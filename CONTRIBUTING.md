# Contributing guidelines

## Commit changes

This project is following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

Use **`npx cz`** instead of `git commit` in order to help you to follow the convention.

> You can install [`commitizen`](https://github.com/commitizen/cz-cli#installing-the-command-line-tool) globally, so you can run `git cz` or simply `cz`.

Any case, there is a git hook configured with Husky for linting the commit message.

> Some IDEs may not be compatible with commit hooks.

## Release process

- Run `npm run release`.

If only fails the publish, you can try `npm run release -- from-package`.
