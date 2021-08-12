describe('Search', () => {
  const BEST_RESULTS_APP_PATH = "/search/all?q=";
  const BEST_RESULTS_API_PATH = `${Cypress.env('serverBaseUrl')}/api/search/all/*`;
  const PAPER_RESULTS_APP_PATH = "/search/paper?q=";
  const PAPER_RESULTS_API_PATH = `${Cypress.env('serverBaseUrl')}/api/search/paper/*`;

  context('Best results', () => {
    beforeEach(() => {
      /*
        This technique is used in situations where we fetch data through
        getInitialProps. In these cases, we cannot intercept the data and replace
        it with a fixture. In order to bypass this restriction we basically
        trigger a reload of the current page programatically which then runs the
        fetch on the client side and allow to intercept.
      */
      cy.visit(BEST_RESULTS_APP_PATH);      
      cy.intercept('GET', BEST_RESULTS_API_PATH, { fixture: 'search-best-results.json' });

      cy.wait(1500);
      const reloadBtn = cy.get('*[data-test="reload-client-side-data"]')
      reloadBtn.click({ force: true });
    });

    it('displays each section in "Best Results"', async () => {
      cy.get(".searchResultsSection").should('exist');
      cy.get('.searchResultsSection').should('have.length', 4);
    });

    it('displays the search navigation', () => {
      cy.get('#tabBarForSearch').should('exist');
    })
  })

  context('Paper results', () => {
    beforeEach(() => {
      cy.visit(BEST_RESULTS_APP_PATH);      
      cy.intercept('GET', BEST_RESULTS_API_PATH, { fixture: 'search-best-results.json' });

      cy.wait(1500);
      const reloadBtn = cy.get('*[data-test="reload-client-side-data"]')
      reloadBtn.click({ force: true });
    });

    it('displays results', () => {
      const paperElems = cy.get('*[data-test^="paper"]');
      paperElems.should('exist');
      paperElems.its('length').should('be.gt', 0);
    });

    it('filters by hub', () => {
      const hubFilter = cy.get('[data-test="select-hubs"]');
      hubFilter.click();

      // Select an arbitrary option
      const opts = hubFilter.find('*[class$="MenuList"]')
      opts.first().click();

      // Check that filter was applied
      cy.get('[data-test^="badge-"]').should('exist'); 
    });
  });

  context('Viewport', () => {
    it('displays expanded search for small screens', () => {
      cy.viewport(650, 1000);
      cy.wait(200);

      cy.visit(BEST_RESULTS_APP_PATH);

      cy.get("#navbarSearch").should('exist');
      cy.get("#navbarSearch")
        .should(($div) => {
          expect($div.attr('class')).to.match(/searchExpanded/)
        });
    });

    it('does not display expanded search in large screens', () => {
      cy.viewport(1500, 1000);
      cy.wait(200);

      cy.visit(BEST_RESULTS_APP_PATH);

      cy.get("#navbarSearch").should('exist');
      cy.get("#navbarSearch")
        .should(($div) => {
          expect($div.attr('class')).to.not.match(/searchExpanded/)
        });     
    })
  });
})