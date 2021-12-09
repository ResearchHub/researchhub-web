import paperFixture from '../../fixtures/paper.json';

describe("Paper", () => {
  const PAPER_APP_PATH = "/paper/1/something";
  const PAPER_API_PATH = `${Cypress.env('serverBaseUrl')}/api/paper/1/*`;

  context("Paper details", () => {
    beforeEach(() => {
      cy.intercept('GET', PAPER_API_PATH, { fixture: 'paper.json' });
      cy.visit(PAPER_APP_PATH);
    });

    xit("diplays paper title", () => {
      const paperCardEl = cy.get(`*[data-test="paper-${paperFixture.id}"]`);

      paperCardEl
        .find("h1")
        .contains(paperFixture.title);
    });

    xit("diplays doi", () => {
      const doiEl = cy.get(`*[data-test="doi"]`);
      doiEl.contains(paperFixture.doi);
    })

    xit("diplays authors", () => {
      const authorElems = cy.get(`*[data-test^="author"]`);
      authorElems.its('length').should('be.gt', 0);
    })

    xit("diplays abstract", () => {
      const abstractEl = cy.get(`*[data-test="abstract"]`);
      abstractEl.contains(paperFixture.abstract);
    })    
  });
});
