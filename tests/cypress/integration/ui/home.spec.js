import { breakpoints } from "../../../../config/themes/screen";
import unifiedFeedFixture from '../../fixtures/unified-feed.json';

describe('Home', () => {
  const APP_PATH = "/";
  const UNIFIED_DOCS_API_PATH = `${Cypress.env('serverBaseUrl')}/api/researchhub_unified_documents/get_unified_documents/*`;

  context("Page elements", () => {

    beforeEach(() => {
      cy.viewport(breakpoints.xxlarge.int, 1000);    
    });

    it("displays unified feed", () => {
      // Replace unified doc payload with fixture data
      cy.intercept('GET', UNIFIED_DOCS_API_PATH, { fixture: 'unified-feed.json' });
      cy.visit(APP_PATH);
      cy.wait(1500);

      // Select filter
      const filterEl = cy.get('[data-test="select-filterBy"]');
      filterEl.click();      

      // Select an arbitrary option
      // This will trigger our intercepted route
      const opts = filterEl.find('*[class$="MenuList"]')
      opts.first().click();  

      // Feed should now have content based on our fixture
      const feedDocs = cy.get(`*[data-test^="document"]`);
      feedDocs.its('length').should('be.eq', unifiedFeedFixture.results.length);
    });

    it("displays leaderboard section", () => {
      cy.visit(APP_PATH);

      const leaderboard = cy.get(`*[data-test="leaderboard"]`);
      leaderboard.should('exist');
    });   

  });

  context("Latest Activity", () => {
    it("display ALL latest activity if user is in ALL section", () => {
      cy.intercept('GET', `${Cypress.env('serverBaseUrl')}/api/user/following_latest_activity/*`).as('allActivityRoute');

      cy.visit(APP_PATH);

      cy.wait("@allActivityRoute").then(xhr=>{
         expect(xhr.request.url).to.include('hub_ids=&')
      })
    });
  })

});