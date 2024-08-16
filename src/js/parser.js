export default function parser(text) {
  const stringToParse = text.replace(/\n/g, " ").replace(/\r/g, " ");
  const object = parseTextStructure(text);
  //...
  const result = "will be added";
  // console.log(object);
  return result;
}

const text1 = `array(4) {
  ["klucz"]=>
  string(7) "wartosc"
  ["klucz_bool"]=>
  bool(true)
  ["klucz_float"]=>
  float(6.34)
  ["klucz_integer"]=>
  int(2)
}`;

const text2 = `array(3) {
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
    array(3) {
      ["zagniezdzony_klucz2"]=>
      string(21) "zagniezdzona_wartosc2"
      ["zagniezdzony_bool"]=>
      bool(false)
      ["zagniezdzony_float"]=>
      float(1.34)
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
}
`;

function extractNestedBraces(inputStr) {
  let depth = 0; // Zmienna pomocnicza licząca głębokość zagnieżdżenia
  let startIndex = -1; // Indeks, w którym zaczyna się pierwszy '{'

  for (let i = 0; i < inputStr.length; i++) {
    let char = inputStr[i];

    if (char === "{") {
      if (depth === 0) {
        startIndex = i; // Zapisz pierwszy występujący '{'
      }
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        // Zwróć fragment stringa od pierwszego '{' do zamykającego '}'
        return inputStr.substring(startIndex, i + 1);
      }
    }
  }

  // Jeśli nie znaleziono pełnego zagnieżdżenia, zwróć pusty string
  return "";
}

function parseTextStructure(t) {
  const text = t.replace(/\n/g, " ").replace(/\r/g, " ");
  let stack = [];
  let output = {};
  let inString = false;

  const keyPattern = /\[(("\w*")|\d+)\]=>/g;
  const lastKeyPattern = /\[(("\w*\")|\d+)\]=>(?!.*\[(("\w*")|\d+)\]=>)/;
  const stringValuePattern = /".*?"/;
  const otherValuePattern = /\((.*?)\)/;
  const arrayPattern = /{.*[^}]/;

  for (let i = 0; i < text.length; i++) {
    const newText = text.slice(i).trim();
    inString = text.charAt(i) === '"' ? !inString : inString;

    if (!inString) {
      if (newText.startsWith("string")) {
        const textBeforeIString = text.slice(0, i);
        const keyString = textBeforeIString.match(lastKeyPattern)[1];
        const stringValue = newText
          .match(stringValuePattern)[0]
          .replace(/"/g, "");
        output = {
          ...output,
          [keyString]: { type: "string", value: stringValue },
        };
      } else if (newText.startsWith("int")) {
        const textBeforeIInt = text.slice(0, i);
        const keyInt = textBeforeIInt.match(lastKeyPattern)[1];
        const intValue = newText.match(otherValuePattern)[1];
        output = {
          ...output,
          [keyInt]: { type: "int", value: parseInt(intValue) },
        };
      } else if (newText.startsWith("float")) {
        const textBeforeIFloat = text.slice(0, i);
        const keyFloat = textBeforeIFloat.match(lastKeyPattern)[1];
        const floatValue = newText.match(otherValuePattern)[1];
        output = {
          ...output,
          [keyFloat]: { type: "int", value: parseFloat(floatValue) },
        };
      } else if (newText.startsWith("bool")) {
        const textBeforeIBool = text.slice(0, i);
        const keyBool = textBeforeIBool.match(lastKeyPattern)[1];
        const boolValue = newText.match(otherValuePattern)[1];
        output = {
          ...output,
          [keyBool]: {
            type: "bool",
            value: boolValue === "true" ? true : false,
          },
        };
      } else if (newText.startsWith("array")) {
        const textBeforeIArr = text.slice(0, i);
        const keyArray =
          textBeforeIArr === ""
            ? null
            : textBeforeIArr.match(lastKeyPattern)[1];
        const arrayContent = extractNestedBraces(newText);
        output =
          textBeforeIArr === ""
            ? { type: "array", value: parseTextStructure(arrayContent) }
            : {
                ...output,
                [keyArray]: {
                  type: "array",
                  value: parseTextStructure(arrayContent),
                },
              };
      }
    }
  }
  console.log(output);
}

