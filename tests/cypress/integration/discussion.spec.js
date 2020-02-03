describe("Discussion Thread Card", function() {
  it("navigates to the discussion page", function() {
    let path = "/paper/1/discussion";
    cy.visit(path);

    // cy.get("#discussion_count").invoke("text").then((count) => {
    //   if (count) {
    //     cy.get("#readLabel").as("button");

    //     cy.get("@button")
    //       .should("have.attr", "href")
    //       .then((href) => {
    //         cy.get("@button").click();
    //         cy.url().should("include", href);
    //       });
    //   }
    // });

  });
});

describe.skip("Discussion Thread Page", function() {
  it("shows thread comments", function() {
    let path = "/paper/1/discussion/1";
    cy.visit(path);

    cy.get("#all_comments_container").find("div");

  });
});
