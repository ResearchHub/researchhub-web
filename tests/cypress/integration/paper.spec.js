describe("Paper Page", function() {
  it("redirects to the summary tab", function() {
    let path = "/paper/1";

    cy.visit(path);
    cy.url().should("include", path + "/summary");

    cy.visit(path + "/");
    cy.url().should("include", path + "/summary");
  });
});
