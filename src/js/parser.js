export function parser(text) {
  const stringToParse = text.trim();
  const object = parseTextStructure(stringToParse);
  //...
  const result = "will be added";
  return result;
}

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

export function parseTextStructure(t) {
  try {
    const text = t.replace(/\n/g, " ").replace(/\r/g, " ");
    let stack = [];
    let output = {};
    let inString = false;

    const keyPattern = /\[(("\w*")|\d+)\]=>/g;
    const lastKeyPattern = /\[(("\w*\")|\d+)\]=>(?!.*\[(("\w*")|\d+)\]=>)/;
    const stringValuePattern = /".*?"/;
    const otherValuePattern = /\((.*?)\)/;
    const arrayTypePattern = /array\(\d*\)/;

    for (let i = 0; i < text.length; i++) {
      const newText = text.slice(i);
      inString = text.charAt(i) === '"' ? !inString : inString;

      if (!inString) {
        if (newText.startsWith("NULL")) {
          const textBeforeINull = text.slice(0, i);
          const keyNull =
            textBeforeINull === ""
              ? null
              : textBeforeINull.match(lastKeyPattern)[1].replace(/\"/g, "");

          output =
            textBeforeINull === ""
              ? { type: "null", value: null }
              : {
                  ...output,
                  [keyNull]: { type: "null", value: null },
                };
        }
        if (newText.startsWith("string")) {
          const textBeforeIString = text.slice(0, i);
          const keyString =
            textBeforeIString === ""
              ? null
              : textBeforeIString.match(lastKeyPattern)[1].replace(/\"/g, "");
          const stringValue = newText
            .match(stringValuePattern)[0]
            .replace(/"/g, "");
          output =
            textBeforeIString === ""
              ? { type: "string", value: stringValue }
              : {
                  ...output,
                  [keyString]: { type: "string", value: stringValue },
                };
        } else if (newText.startsWith("int")) {
          const textBeforeInt = text.slice(0, i);
          const keyInt =
            textBeforeInt === ""
              ? null
              : textBeforeInt.match(lastKeyPattern)[1].replace(/\"/g, "");
          const intValue = newText.match(otherValuePattern)[1];
          output =
            textBeforeInt === ""
              ? { type: "int", value: parseInt(intValue) }
              : {
                  ...output,
                  [keyInt]: { type: "int", value: parseInt(intValue) },
                };
        } else if (newText.startsWith("float")) {
          const textBeforeIFloat = text.slice(0, i);
          const keyFloat =
            textBeforeIFloat === ""
              ? null
              : textBeforeIFloat.match(lastKeyPattern)[1].replace(/\"/g, "");
          const floatValue = newText.match(otherValuePattern)[1];
          debugger;
          output =
            textBeforeIFloat === ""
              ? { type: "float", value: parseFloat(floatValue) }
              : {
                  ...output,
                  [keyFloat]: { type: "float", value: parseFloat(floatValue) },
                };
        } else if (newText.startsWith("bool")) {
          const textBeforeIBool = text.slice(0, i);
          const keyBool =
            textBeforeIBool === ""
              ? null
              : textBeforeIBool.match(lastKeyPattern)[1].replace(/\"/g, "");
          const boolValue = newText.match(otherValuePattern)[1];

          output =
            textBeforeIBool === ""
              ? {
                  type: "bool",
                  value: boolValue === "true" ? true : false,
                }
              : {
                  ...output,
                  [keyBool]: {
                    type: "bool",
                    value: boolValue === "true" ? true : false,
                  },
                };
        } else if (newText.startsWith("array")) {
          const textBeforeIArr = text.slice(0, i);
          const arrayTypeLength = newText.match(arrayTypePattern)[0]
            ? newText.match(arrayTypePattern)[0].length
            : 0;
          const keyArray =
            textBeforeIArr === ""
              ? null
              : textBeforeIArr.match(lastKeyPattern)[1].replace(/\"/g, "");
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

          i = i + arrayContent.length + arrayTypeLength;
  
        }
      }
    }
    return output;
  } catch (error) {
    console.error("Error parsing text structure:", error);
    return { error: "Failed to parse text structure." };
  }
}
