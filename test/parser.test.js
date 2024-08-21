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

const result1 = `$output[]
$output["klucz"] = 'wartosc'
$output["klucz_bool"] = true
$output["klucz_float"] = 6.34
$output["klucz_integer"] = 2`;

const result2 = `$output[]
$output[0][0]["zagniezdzony_klucz"] = 'array(3)'
$output[0][0]["zagniezdzony_bool"] = true
$output[0][0]["zagniezdzony_float"] = 6.34
$output[0][1]["zagniezdzony_klucz"] = 'zagniezdzona_wartosc2'
$output[0][1]["zagniezdzony_bool"] = false
$output[0][1]["zagniezdzony_float"] = 1.34
$output[0][1]["zagniezdzony_null"] = null
$output["klucz"] = 'wartosc'
$output["moje_liczby"][0] = 3
$output["moje_liczby"][1] = 4
$output["moje_liczby"][2] = 1
$output["moje_liczby"][3] = 5
$output["moje_liczby"][4] = 7`;

describe("parse text to object test", () => {
  it("should return correct value in case of simple objects", () => {
    expect(parser(`string(11) "Hello world"`)).to.equal(
      '$output = Hello world'
    );
    expect(parser(`float(3.3)`)).to.equal("$output = 3.3");
    expect(parser(`int(15)`)).to.equal("$output = 15");
    expect(parser(`NULL`)).to.equal("$output = null");
    expect(parser(`bool(false)`)).to.equal("$output = false");
    expect(parser(example1)).to.equal(result1);
  });
  it("should return correct value in case of nested objects", () => {
    expect(parser(example2)).to.equal(result2);
  });
  it("should return error text when incorrectly formated input", () => {
    expect(parser(`array {"klucz"=>string(7) "wartosc"`)).to.equal(
      "Unable to parse your input. Please ensure you're passing the correct var_dump output. Double-check the format and try again."
    );
  });
  it("should return correct text when string starts with non printable sighs", () => {
    expect(parser(`\n\n\n\r\r\s\sarray(4) {["klucz_float"]=> float(6.34)`)).to.equal(
      "Unable to parse your input. Please ensure you're passing the correct var_dump output. Double-check the format and try again."
    );
  });

  
});
