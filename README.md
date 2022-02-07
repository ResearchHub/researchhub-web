<p align="left">    
    <h1 align="left">The <a aria-label="RH logo" href="https://researchhub.com">ResearchHub</a> Next.js Web App </h1>
</p>


<p align="left">
  <a aria-label="Join the community" href="https://researchhub-community.slack.com">
    <img alt="" src="https://badgen.net/badge/Join%20the%20community/Slack/yellow?icon=slack">
  </a>
</p>
<p align="center">&nbsp;</p>


## Our Mission
```
Our mission is to accelerate the pace of scientific research 🚀 
```
We believe that by empowering scientists to independently fund, create, and publish academic content we can revolutionize the speed at which new knowledge is created and transformed into life-changing products.

## Important Links  👀
💡 Got an idea or request? [Create a discussion on Github](https://github.com/ResearchHub/researchhub-web-internal/discussions/categories/ideas-and-requests).  
❓ Got a question? [Ask it here](https://github.com/ResearchHub/researchhub-web-internal/discussions/categories/q-a)  
🐛 Found a bug? [Report it here](https://github.com/ResearchHub/researchhub-web-internal/discussions/categories/bugs)  
💰 Earn ResearchCoin (RSC) by [completing bounties](https://github.com/ResearchHub/researchhub-web-internal/issues)  
🙌 Want to work with us? [View our open positions](https://www.notion.so/researchhub/Working-at-ResearchHub-6e0089f0e234407389eb889d342e5049)  
➕ Want to contribute to this project? [Introduce yourself in our Slack community](https://researchhub-community.slack.com)  
📰 Read the [ResearchCoin White Paper](https://www.researchhub.com/paper/819400/the-researchcoin-whitepaper)

## Setup

1. `nvm use` (installing [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
2. `yarn install`
3. `npm run dev`

## Contributing to the codebase

1. Fork this repo and then clone it to your local device
2. Create a new branch
```
git checkout -b MY_BRANCH_NAME
```
3. Submit a pull request against `master` branch of this repository

## Bounties
- Bounties are regularly listed in the <a href="issues">issues</a> section.
- Issues with a bounty associated will have the bounty badge
- Bounties will be paid in the form or Research Coin (RSC)
- Bounty will need to be explicitly approved by a member of the Research Hub team


## Tests

#### Integration Tests

Integration tests are created using [cypress](https://www.cypress.io/)

- Run `npm run test` to run all integration tests in headless mode
- Run `npm run cy:open` to pick which tests to run in browser mode
- Run `npm run cy:spec --spec path/to/your/test` to run a specific spec.  
  e.g. `npm run cy:spec --spec tests/cypress/integration/ui/search.spec.js`
