## Setup

1. `nvm use` (installing [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
2. `yarn install`
3. `npm run dev`

## Contributing to the codebase

- Follow this [short guide](https://www.notion.so/researchhub/Philosophy-758dd755003e4f49b55e78468bda35e3?p=91e1c8d75502434f9c0a4eda29f4b421&showMoveTo=true) to ensure our bundle sizes remain optimal
- Write tests
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
