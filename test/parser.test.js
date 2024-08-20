import { parser, parseTextStructure } from "../src/js/parser.js";
import { expect } from "chai";

const example1 = `array(4) {
  ["klucz"]=>
  string(7) "wartosc"
  ["klucz_bool"]=>
  bool(true)
  ["klucz_float"]=>
  float(6.34)
  ["klucz_integer"]=>
  int(2)
}`;
const example2 = `array(3) {
  ["klucz"]=>
  string(7) "wartosc"
  [0]=>
  array(2) {
    [0]=>
    array(3) {
      ["zagniezdzony_klucz"]=>
      string(8) "array(3)"
      ["zagniezdzony_bool"]=>
      bool(true)
      ["zagniezdzony_float"]=>
      float(6.34)
    }
    [1]=>
    array(4) {
      ["zagniezdzony_klucz"]=>
      string(21) "zagniezdzona_wartosc2"
      ["zagniezdzony_bool"]=>
      bool(false)
      ["zagniezdzony_float"]=>
      float(1.34)
      ["zagniezdzony_null"]=>
      NULL
    }
  }
  ["moje_liczby"]=>
  array(5) {
    [0]=>
    int(3)
    [1]=>
    int(4)
    [2]=>
    int(1)
    [3]=>
    int(5)
    [4]=>
    int(7)
  }
}`;

const result1 = {
  type: "array",
  value: {
    klucz: {
      type: "string",
      value: "wartosc",
    },
    klucz_bool: {
      type: "bool",
      value: true,
    },
    klucz_float: {
      type: "float",
      value: 6.34,
    },
    klucz_integer: {
      type: "int",
      value: 2,
    },
  },
};
const result2 = {
  type: "array",
  value: {
    0: {
      type: "array",
      value: {
        0: {
          type: "array",
          value: {
            zagniezdzony_klucz: {
              type: "string",
              value: "array(3)",
            },
            zagniezdzony_bool: {
              type: "bool",
              value: true,
            },
            zagniezdzony_float: {
              type: "float",
              value: 6.34,
            },
          },
        },
        1: {
          type: "array",
          value: {
            zagniezdzony_klucz: {
              type: "string",
              value: "zagniezdzona_wartosc2",
            },
            zagniezdzony_bool: {
              type: "bool",
              value: false,
            },
            zagniezdzony_float: {
              type: "float",
              value: 1.34,
            },
            zagniezdzony_null: {
              type: "null",
              value: null,
            },
          },
        },
      },
    },
    klucz: {
      type: "string",
      value: "wartosc",
    },
    moje_liczby: {
      type: "array",
      value: {
        0: {
          type: "int",
          value: 3,
        },
        1: {
          type: "int",
          value: 4,
        },
        2: {
          type: "int",
          value: 1,
        },
        3: {
          type: "int",
          value: 5,
        },
        4: {
          type: "int",
          value: 7,
        },
      },
    },
  },
};

describe("parse text to object test", () => {

  it("should return correct value in case of simple objects", () => {
    expect(parseTextStructure(`string(11) "Hello world"`)).to.deep.equal({
      type: "string",
      value: "Hello world",
    });
    expect(parseTextStructure(`float(3.3)`)).to.deep.equal({
      type: "float",
      value: 3.3,
    });
    expect(parseTextStructure(`int(15)`)).to.deep.equal({
      type: "int",
      value: 15,
    });
    expect(parseTextStructure(`NULL`)).to.deep.equal({
      type: "null",
      value: null,
    });
    expect(parseTextStructure(`bool(false)`)).to.deep.equal({
      type: "bool",
      value: false,
    });
    expect(parseTextStructure(example1)).to.deep.equal(result1);
  });
  it("should return correct value in case of nested objects", () => {
    expect(parseTextStructure(example2)).to.deep.equal(result2);
  });
  it("should return error value when incorrectly formated input", () => {
    expect(
      parseTextStructure(`array {"klucz"=>string(7) "wartosc"`)
    ).to.deep.equal({ error: "Failed to parse text structure." });
  });
  it("should return empty object when empty string", () => {
    expect(parseTextStructure("")).to.deep.equal({});
  });
});
