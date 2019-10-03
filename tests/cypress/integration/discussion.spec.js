describe("Discussion Thread Card", function() {
  // TODO: Only test this is we know we have threads
  it.skip("navigates to the discussion page", function() {
    let path = "/paper/1/discussion";
    cy.visit(path);

    cy.get("a").contains("Read").as("button");

    cy.get("@button")
      .should("have.attr", "href")
      .then((href) => {
        cy.get("@button").click();
        cy.url().should("include", href);
      });
  });
});
