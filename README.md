## Setup

1. `yarn install`
2. `npm run dev`

## Making Changes

- Our pre-commit hooks will run automatically upon commit (i.e. linting)
- To skip pre-commit hooks, add `--no-verify` flag to force commit (not recommended)

## Tests

#### Integration Tests

Integration tests are created using [cypress](https://www.cypress.io/)

- Run `npm run test` to run all integration tests in headless mode
- Run `npm run cy:open` to pick which tests to run in browser mode
- Run `npm run cy:spec --spec path/to/your/test` to run a specific spec.  
  e.g. `npm run cy:spec --spec tests/cypress/integration/ui/search.spec.js`

## More Info

- This project was bootstrapped with [Create Next App](https://github.com/segmentio/create-next-app).
- Find the most recent version of this guide at [here](https://github.com/segmentio/create-next-app/blob/master/lib/templates/default/README.md). And check out [Next.js repo](https://github.com/zeit/next.js) for the most up-to-date info.
