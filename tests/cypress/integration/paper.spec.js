describe("Paper Page", function() {
  const paperTitle = "";
  const paperTagline = "";

  before(function() {
    let path = "/paper/1";
    cy.visit(path);
  });

  it("redirects to the summary tab", function() {
    cy.url().should("include", path + "/summary");

    cy.visit(path + "/");
    cy.url().should("include", path + "/summary");
  });

  it.skip("has the paper title in the head title element", function() {
    cy.get("title").contains(paperTitle);
  });

  it.skip("has the paper tagline in the head meta description element", function() {
    cy.get("meta[name='description']").should(
      "have.attr",
      "content",
      paperTagline
    );
  });

});
