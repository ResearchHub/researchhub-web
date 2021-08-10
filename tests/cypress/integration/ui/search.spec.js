describe('Search', () => {
  const BEST_RESULTS_PATH = "/search/all?q="

  context('Best Results', () => {
    it('displays each section in "Best Results"', async () => {

      cy.visit(BEST_RESULTS_PATH);      
      cy.intercept('GET', 'http://localhost:8000/api/search/all*', { fixture: 'search-best-results.json' }).as("bestResultsAPIRoute");

      const bestResultsTab = cy.get('#tabType--all');
      bestResultsTab.click();

      cy.get('.SearchResultsSection').should('have.length', 4);
    })
    // it('displays the search navigation', () => {
    //   expect(true).to.equal(false);  
    // })
  })

//   context('Viewport', () => {
//     it('displays search toggle for small screens', () => {
//       expect(true).to.equal(false);  
//     })
// 
//     it('displays search input (no toggle) for larger screens', () => {
//       expect(true).to.equal(false);  
//     })
//   });

//   context('Papers', () => {
//     it('filters by published date', () => {
//       expect(true).to.equal(false);  
//     })
// 
//     it('filters by hub', () => {
//       expect(true).to.equal(false);  
//     })
// 
//     it('sorts by top rated', () => {
//       expect(true).to.equal(false);  
//     })    
//   })
})