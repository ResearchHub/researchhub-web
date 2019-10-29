describe("Paper Page", function() {
  const path = "/paper/1";
  const paperTitle = "";
  const paperTagline = "";

  before(function() {
    cy.visit(path);
  });

  it("redirects to the summary tab", function() {
    cy.url().should("include", path + "/summary");

    cy.visit(path + "/");
    cy.url().should("include", path + "/summary");
  });

  // TODO: Test tab pages other than summary as well

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
