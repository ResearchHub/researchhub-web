import { endsWithSlash } from "../../../../config/utils/routing";

describe("Routing Utils", function() {
  context("endsWithSlash", function() {
    it("returns true if the string ends with a forward slash", () => {
      const text = "https://localhost:3000/hello/";
      const result = endsWithSlash(text);
      expect(result).to.be.true;
    });

    it("returns false if the string ends with a back slash", () => {
      const text = "https://localhost:3000/hello\\";
      const result = endsWithSlash(text);
      expect(result).to.be.false;
    });

    it("returns false if the string does not end with a forward slash", () => {
      const text = "https://localhost:3000/hello";
      const result = endsWithSlash(text);
      expect(result).to.be.false;
    });

    it("returns false if the string is empty", () => {
      const text = "";
      const result = endsWithSlash(text);
      expect(result).to.be.false;
    });

    it("returns false if the argument is not a string", () => {
      const text = 5;
      expect(() => endsWithSlash(text)).to.throw(TypeError);
    });

  });
});
