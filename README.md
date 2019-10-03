This project was bootstrapped with [Create Next App](https://github.com/segmentio/create-next-app).

Find the most recent version of this guide at [here](https://github.com/segmentio/create-next-app/blob/master/lib/templates/default/README.md). And check out [Next.js repo](https://github.com/zeit/next.js) for the most up-to-date info.

## Setup

### Git hooks

(**_Skip these steps to let husky do it instead._**)

Set executable permissions on scripts

`$ chmod -R u+x scripts/`

Install git hooks

`$ ./scripts/install-hooks`

**Migrating to husky**

To use husky instead of git hooks manually:
1. Delete or move the original git hooks `$ mkdir .git/hooks-old && cp -R .git/hooks .git/hooks-old`
2. Re-add husky `$ yarn remove husky` `$ yarn add husky --dev`
3. Husky should write the hook files for you. You can check this by printing the hook file `$ cat .git/hooks/pre-push` and checking it starts with this:
```
#!/bin/sh
# husky
```

For more info see https://github.com/typicode/husky

## Making Changes

Running `$ git push` will trigger a git pre-push hook that will run all tests.
If you want to push something without testing it run `$ git push --no-verify`. (This is not recommended :)
