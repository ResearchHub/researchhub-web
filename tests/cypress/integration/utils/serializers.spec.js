import { Value } from "slate";

import slateData from "../../fixtures/slate";

import { convertToEditorValue } from "../../../../config/utils";

describe("Serializer Utils", function() {
  context("convertToEditorValue", function() {

    it("returns a Slate Value object given a string", () => {
      const text = "Hello computer";
      const value = convertToEditorValue(text);
      const result = value._values._tail.array[2]._values._tail.array[2].size;
      expect(Value.isValue(value)).to.be.true;
      expect(result).to.be.greaterThan(0);
    });

    it("returns a Slate Value object given Slate JSON", () => {
      const text = slateData.rich;
      const value = convertToEditorValue(text);
      const result = value._values._tail.array[2]._values._tail.array[2].size;
      expect(Value.isValue(value)).to.be.true;
      expect(result).to.be.greaterThan(0);
    });

    it("returns an empty Slate value object given arbitrary JSON", () => {
      const text = {"arbitrary": "json"};
      const value = convertToEditorValue(text);
      const result = value._values._tail.array[2]._values._tail.array[2].size;
      expect(Value.isValue(value)).to.be.true;
      expect(result).to.equal(0);
    });

  });
});