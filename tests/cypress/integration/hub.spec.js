describe.skip("Hub Page", function() {
  const hubName = "Cryptography";

  before(function() {
    // TODO: Visit the first item on the hubs page instead of hard coding
    cy.visit(`/hub/${hubName}`);
  });

  it("has the hub name in the head title element", function() {
    cy.get("title").contains(hubName);
  });

  it("has the hub name in the head meta description element", function() {
    cy.get("meta[name='description']").should(
      "have.attr",
      "content",
      hubName 
    );
  });

});
