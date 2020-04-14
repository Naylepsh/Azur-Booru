const miscUtils = require("../utils/misc");

describe("pickAttributes", () => {
  it("should pick all attributes", () => {
    const source = { attr1: "val1", attr2: "val2" };
    const result = miscUtils.pickAttributes(source, Object.keys(source));

    expect(result).toBeDefined();
    expect(result.attr1).toBe(source.attr1);
    expect(result.attr2).toBe(source.attr2);
  });

  it("should pick only attr1", () => {
    const source = { attr1: "val1", attr2: "val2" };
    const result = miscUtils.pickAttributes(source, ["attr1"]);

    expect(result).toBeDefined();
    expect(result.attr1).toBe(source.attr1);
    expect(result.attr2).not.toBeDefined();
  });
});

describe("swapKeysAndValues", () => {
  it("should swap string keys and args", () => {
    const source = { key1: "val1", key: "val2" };
    const result = miscUtils.swapKeysAndValues(source);

    expect(result).toBeDefined();
    for (const key in source) {
      const value = source[key];
      expect(result[value]).toBe(key);
    }
  });

  it("should swap object keys and args", () => {
    const source = {
      ["a"]: "val",
      1: "otherVal",
    };
    const result = miscUtils.swapKeysAndValues(source);

    expect(result).toBeDefined();
    for (const key in source) {
      const value = source[key];
      expect(result[value]).toBe(key);
    }
  });

  it("should throw eror if values are not unique", () => {
    const source = { a: 1, b: 1 };

    expect(() => miscUtils.swapKeysAndValues(source)).toThrow();
  });
});

describe("toggleInArray", () => {
  it("should add item to array", () => {
    const source = [1, 2];
    const valueToAdd = 3;
    const result = miscUtils.toggleInArray(valueToAdd, source);

    expect(result).toContain(valueToAdd);
  });

  it("should not remove other items", () => {
    const source = [1, 2];
    const valueToAdd = 3;
    const result = miscUtils.toggleInArray(valueToAdd, source);

    for (const val of source) {
      expect(result).toContain(val);
    }
  });

  it("should remove item", () => {
    const source = [1, 2];
    const valueToRemove = source[0];
    const result = miscUtils.toggleInArray(valueToRemove, source);

    expect(result).not.toContain(valueToRemove);
  });
});

describe("removeFromArrayIfExists", () => {
  it("should remove existing item", () => {
    const source = [1, 2];
    const valueToRemove = source[0];
    const result = miscUtils.removeFromArrayIfExists(valueToRemove, source);

    expect(result).not.toContain(valueToRemove);
  });

  it("should return the same array", () => {
    const source = [1, 2];
    const valueToRemove = 3;
    const result = miscUtils.removeFromArrayIfExists(valueToRemove, source);

    expect(result).toBe(source);
  });
});

describe("distinctWordsInString", () => {
  it("should return all words from string of unique words", () => {
    const source = "word1 word2";
    const result = miscUtils.distinctWordsInString(source);

    expect(result).toContain("word1");
    expect(result).toContain("word2");
  });

  it("should return only one word", () => {
    const source = "word1 word1";
    const result = miscUtils.distinctWordsInString(source);

    expect(result.length).toBe(1);
    expect(result).toContain("word1");
  });

  it("should handle empty string", () => {
    const source = "";
    const result = miscUtils.distinctWordsInString(source);

    expect(result.length).toBe(0);
  });
});
