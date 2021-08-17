import { doesNotExist, getNestedValue, isEmpty } from "~/config/utils";

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

  context("getNestedValue", function() {
    it("returns the value nested 3 layers deep", () => {
      const obj = { a: { b: { c: 42 } } };
      const result = getNestedValue(obj, ["a", "b", "c"]);
      expect(result).to.equal(42);
    });

    it("returns the value nested 1 layer deep", () => {
      const obj = { a: 24 };
      const result = getNestedValue(obj, ["a"]);
      expect(result).to.equal(24);
    });

    it("returns the defaultValue if the end value does not exist", () => {
      const defaultValue = 33;
      const obj0 = { a: 24 };
      const obj1 = { a: 24, b: { c: 42 } };
      const obj2 = { a: { b: { c: 42 } } };
      const obj3 = undefined;
      const res0 = getNestedValue(obj0, ["b"], defaultValue);
      const res1 = getNestedValue(obj1, ["a", "b"], defaultValue);
      const res2 = getNestedValue(obj2, ["a", "b", "d"], defaultValue);
      const res3 = getNestedValue(obj3, ["a", "b", "d"], defaultValue);
      const expected = 33;
      expect(res0).to.equal(expected);
      expect(res1).to.equal(expected);
      expect(res2).to.equal(expected);
      expect(res3).to.equal(expected);
    });

    it("returns null if the end value does not exist and no defaultValue is provided", () => {
      const obj0 = { a: 24 };
      const obj1 = { a: 24, b: { c: 42 } };
      const obj2 = { a: { b: { c: 42 } } };
      const obj3 = undefined;
      const res0 = getNestedValue(obj0, ["b"]);
      const res1 = getNestedValue(obj1, ["a", "b"]);
      const res2 = getNestedValue(obj2, ["a", "b", "d"]);
      const res3 = getNestedValue(obj3, ["a", "b", "d"]);
      expect(res0).to.equal(null);
      expect(res1).to.equal(null);
      expect(res2).to.equal(null);
      expect(res3).to.equal(null);
    });

  });

  context("isEmpty", function() {
    it("returns true given an empty string", () => {
      const string = "";
      const result = isEmpty(string);
      expect(result).to.be.true;
    });

    it("returns false given a NOT empty string", () => {
      const string = " ";
      const result = isEmpty(string);
      expect(result).to.be.false;
    });

    it("returns true given an empty object", () => {
      const obj = {};
      const result = isEmpty(obj);
      expect(result).to.be.true;
    });

    it("returns false given a NOT empty object", () => {
      const obj = { hello: "world" };
      const result = isEmpty(obj);
      expect(result).to.be.false;
    });

    it("returns false given a number", () => {
      const n0 = 0;
      const res0 = isEmpty(n0);
      expect(res0).to.be.false;
      const n1 = 1;
      const res1 = isEmpty(n1);
      expect(res1).to.be.false;
      const n2 = -1;
      const res2 = isEmpty(n2);
      expect(res2).to.be.false;
    });

  });

});
