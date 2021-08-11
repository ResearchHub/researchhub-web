import Router from 'next/router'

describe("Paper", function() {
  const PAPER_APP_PATH = "/paper/1";

  context("Paper details", () => {
    it("diplays paper title", function() {
      Router.reload(window.location.pathname);

      // cy.visit(PAPER_APP_PATH);

      // cy.intercept('GET', BEST_RESULTS_API_PATH, { fixture: 'search-best-results.json' });

    });
  });


//   it("redirects to the summary tab", function() {
//     cy.url().should("include", path + "/summary");
// 
//     cy.visit(path + "/");
//     cy.url().should("include", path + "/summary");
//   });
// 
//   // TODO: Test tab pages other than summary as well
// 
//   it.skip("has the paper title in the head title element", function() {
//     cy.get("title").contains(paperTitle);
//   });
// 
//   it.skip("has the paper tagline in the head meta description element", function() {
//     cy.get("meta[name='description']").should(
//       "have.attr",
//       "content",
//       paperTagline
//     );
//   });

});
