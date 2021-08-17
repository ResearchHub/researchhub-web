import { breakpoints } from "../../../../config/themes/screen";

describe("Auth", () => {
  const APP_PATH = "/about";

  context("Google", () =>{
    beforeEach(() => {
      cy.visit(APP_PATH, {
        onBeforeLoad(win) {
          cy.stub(win, 'open')
        }
      });
    });

    it('clicking "Login" button displays google login [Desktop]', () => {
      cy.viewport(breakpoints.xxlarge.int, 1000);
      cy.wait(200);

      const loginBtn = cy.get(`*[data-test="google-login-btn"] button:visible`);
      loginBtn.click();
      
      cy.window().its('open').should('be.called');
    });

    it('clicking "Login" button displays google login [Mobile]', () => {
      cy.viewport(breakpoints.xsmall.int, 1000);
      cy.wait(200);

      const mobileMenuBtn = cy.get(`*[data-test="navbar-mobile-trigger"]`);
      mobileMenuBtn.click();
      cy.wait(250);

      const loginBtn = cy.get(`*[data-test="google-login-btn"] button:visible`);
      loginBtn.click();
      
      cy.window().its('open').should('be.called');
    });
  });

});