import { Value } from "slate";
import Plain from "slate-plain-serializer";

import slateData from "../../fixtures/slate";

import { convertToEditorValue } from "../../../../config/utils";

describe("Serializer Utils", function() {
  context("convertToEditorValue", function() {

    it("returns the received Slate Value object", () => {
      const value = Plain.deserialize("A slate value object");
      const result = convertToEditorValue(value);
      expect(Value.isValue(result)).to.be.true;
      expect(result).to.equal(value);
    });

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

    it("returns an empty Slate value object given a boolean", () => {
      const t = true;
      const f = false;
      const value = convertToEditorValue(t);
      const value1 = convertToEditorValue(f);
      const result = value._values._tail.array[2]._values._tail.array[2].size;
      const result1 = value1._values._tail.array[2]._values._tail.array[2].size;
      expect(Value.isValue(value)).to.be.true;
      expect(Value.isValue(value1)).to.be.true;
      expect(result).to.equal(0);
      expect(result1).to.equal(0);
    });

    it("returns an empty Slate value object given an integer", () => {
      const text = 1;
      const value = convertToEditorValue(text);
      const result = value._values._tail.array[2]._values._tail.array[2].size;
      expect(Value.isValue(value)).to.be.true;
      expect(result).to.equal(0);
    });

    it("returns an empty Slate value object given a non-boolean integer", () => {
      const text = 2;
      const value = convertToEditorValue(text);
      const result = value._values._tail.array[2]._values._tail.array[2].size;
      expect(Value.isValue(value)).to.be.true;
      expect(result).to.equal(0);
    });

    it("returns an empty Slate value object given a float", () => {
      const text = 0.3;
      const value = convertToEditorValue(text);
      const result = value._values._tail.array[2]._values._tail.array[2].size;
      expect(Value.isValue(value)).to.be.true;
      expect(result).to.equal(0);
    });

    it("returns undefined given undefined or null", () => {
      expect(convertToEditorValue(undefined)).to.equal(undefined);
      expect(convertToEditorValue(null)).to.equal(undefined);
    });

  });
});