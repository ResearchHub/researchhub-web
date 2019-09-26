import { doesNotExist } from "../../../../config/utils";

describe("General Utils", function() {
  context("doesNotExist", function() {
    it("returns true if the value is null", () => {
      const val = null;
      const result = doesNotExist(val);
      expect(result).to.be.true;
    });

    it("returns true if the value is undefined", () => {
      const val = undefined;
      const result = doesNotExist(val);
      expect(result).to.be.true;
    });

    it("returns false if the value is 0", () => {
      const val = 0;
      const result = doesNotExist(val);
      expect(result).to.be.false;
    });

    it("returns false if the value is 1", () => {
      const val = 1;
      const result = doesNotExist(val);
      expect(result).to.be.false;
    });

    it("returns false if the value is an empty string", () => {
      const val = "";
      const result = doesNotExist(val);
      expect(result).to.be.false;
    });

  });
});
