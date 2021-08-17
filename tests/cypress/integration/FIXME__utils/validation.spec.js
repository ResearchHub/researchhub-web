import { isValidEmail } from "../../../../config/utils/validation";

describe("Validation Utils", function() {
  context("isValidEmail", function() {
    it("returns true if the email ends in .edu", () => {
      const email = "val@quantfive.edu";
      const result = isValidEmail(email);
      expect(result).to.be.true;
    });

    it("returns false if the email does NOT end in .edu", () => {
      const email = "val@quantfive.org";
      const result = isValidEmail(email);
      expect(result).to.be.false;
    });

  });

});
