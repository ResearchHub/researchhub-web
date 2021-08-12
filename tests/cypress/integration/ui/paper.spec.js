import Router from 'next/router'
import paperFixture from '../../fixtures/paper.json';

describe("Paper", () => {
  const PAPER_APP_PATH = "/paper/1/something";
  const PAPER_API_PATH = "http://localhost:8000/api/paper/1/?make_public=true&";

  context("Paper details", () => {
    beforeEach(() => {
      cy.intercept('GET', PAPER_API_PATH, { fixture: 'paper.json' });
      cy.visit(PAPER_APP_PATH);
    });

    it("diplays paper title", () => {
      cy.get(`*[data-test="paper-${paperFixture.id}"]`)
        .find("h1")
        .contains(paperFixture.title);
    });

    it("diplays doi", () => {
      cy.get(`*[data-test="doi"]`)
        .contains(paperFixture.doi);      
    })

    it("diplays authors", () => {
      cy.get(`*[data-test^="author"]`)
        .its('length').should('be.gt', 0);
    })

    it("diplays abstract", () => {
      cy.get(`*[data-test="abstract"]`)
        .contains(paperFixture.abstract);
    })    
  });
});
