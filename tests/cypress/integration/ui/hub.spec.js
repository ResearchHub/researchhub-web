import hubListFixture from '../../fixtures/hub-list.json';
import { breakpoints } from "../../../../config/themes/screen";

describe("Hubs", () => {
  const HUBS_APP_PATH = "/hubs";
  const HUBS_API_PATH = `${Cypress.env('serverBaseUrl')}/api/hub/*`;  

  context("List view", () => {
    beforeEach(() => {
      cy.intercept('GET', HUBS_API_PATH, { fixture: 'hub-list.json' });
      cy.visit(HUBS_APP_PATH);
    });

    it("renders each hub card", () => {
      const hubCards = cy.get(`*[data-hub-id]`);
      hubCards.its('length').should('be.eq', hubListFixture.count);
    })
  })

  context("Card view", () => {
    beforeEach(() => {
      cy.intercept('GET', HUBS_API_PATH, { fixture: 'hub-list.json' });
      cy.visit(HUBS_APP_PATH);
    });

    it('contains hub stats', () => {
      const hubData = hubListFixture.results[0];
      const hubCard = cy.get(`*[data-hub-id="${hubData.id}"]`);

      hubCard
        .find('*[data-test^="hub-stats"]')
        .should('exist');
    });

    it('contains hub name', () => {
      const hubData = hubListFixture.results[0];
      const hubCard = cy.get(`*[data-hub-id="${hubData.id}"]`);

      hubCard
        .find(`*[data-test="hub-name"]`)
        .contains(hubData.name);
    });

    it('contains hub description', () => {
      const hubData = hubListFixture.results[0];
      const hubCard = cy.get(`*[data-hub-id="${hubData.id}"]`);

      hubCard
        .find(`*[data-test="hub-description"]`)
        .contains(hubData.description);
    });
  })

  context("Viewport", () => {
    beforeEach(() => {
      cy.intercept('GET', HUBS_API_PATH, { fixture: 'hub-list.json' });
      cy.visit(HUBS_APP_PATH);
    });

    it('renders the sidebar in screen', () => {
      cy.viewport(breakpoints.xxlarge.int, 1000);
     
      cy.get(`*[data-test="category-list"]`)
        .should('exist');
    })
  });
});