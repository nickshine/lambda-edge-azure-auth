# Contributing

All contributions are welcome. Please [create an issue][issues] in order open up communication
with the community.

## Limitations

Be considerate of the [Lambda@Edge limitations][limitations]. The zipped function can be no more
than 1MB in size and execution cannot take longer than 5 seconds, so we must pay close attention
to the size of our dependencies and complexity of operations.

## Commit Message Guidelines

This project follows the [Conventional Commits] specification to aid in automated releases and
change log generation. [Commitlint] is enabled and ran as a `commit-msg` hook to enforce the
commit format. [Commitizen] can be used to prompt through any requirements at commit time `npm
run cm` (or `git cz` if Commitizen is installed globally).

In short, if a commit will be fixing a bug, prefix the commit message with `fix:`

```bash
fix: my bug fix
```

If a commit will be adding a feature, prefix the commit message with `feat:`

```bash
feat: my new feature
```

Commits with `fix:` prefix will show up in the generated changelog as bullets
under the `Bug Fixes:` section, and `feat:` prefixed messages will show under
the `Features:` section. For more on the available prefixes/rules, see 
[here][conventional-changelog].

[commitlint]:https://github.com/conventional-changelog/commitlint
[commitizen]:http://commitizen.github.io/cz-cli/
[conventional-changelog]:https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#rules
[Conventional Commits]:https://www.conventionalcommits.org/en/v1.0.0-beta.3/
[issues]:https://github.com/nickshine/lambda-edge-azure-auth/issues
[limitations]:https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html#limits-lambda-at-edge
