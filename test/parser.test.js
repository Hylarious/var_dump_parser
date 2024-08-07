import parser from '../src/js/parser.js'

import { expect } from 'chai';

// describe("Parser test", () => {
//   it("should return correct value", () => {
//     const example = `array(4) {
//     ["klucz"]=>
//     string(7) "wartosc"
//     ["klucz_bool"]=>
//     bool(true)
//     ["klucz_float"]=>
//     float(6.34)
//     ["klucz_integer"]=>
//     int(2)
//     }`;

//     expect(parser(example)).to.equal(`$output = [];
//     $output['klucz'] = 'wartosc';
//     $output['klucz_bool'] = true;
//     $output['klucz_float'] = 6.34;
//     $output['klucz_integer'] = 2;"};`);
//   });
// });
