export function parser(text) {
  let object = {};
  let result = "";
  const stringToParse = text.trim();
  object = parseTextStructure(stringToParse);
  result = parseObjectToOutput(object);

  const isEmptyObject = Object.keys(object).length === 0;
  console.log(object, result);
  if (isEmptyObject || object === undefined || object.error || result === "") {
    return "Unable to parse your input. Please ensure you're passing the correct var_dump output. Double-check the format and try again.";
  } else if (object.error) {
    console.log('here')
    return "Unable to parse your input. Please ensure you're passing the correct var_dump output. Double-check the format and try again.";
  }
  return object.type === "array"
    ? `$output[]\n$output` + result
    : "$output" + result;
}

//#region nested array extraction
function extractNestedBrackets(inputStr) {
  let depth = 0; // Auxiliary variable counting the nesting depth
  let startIndex = -1; // Index where the first '{' starts

  for (let i = 0; i < inputStr.length; i++) {
    let char = inputStr[i];

    if (char === "{") {
      if (depth === 0) {
        startIndex = i; // Save the position of the first '{'
      }
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        // Return the substring from the first '{' to the closing '}'
        return inputStr.substring(startIndex, i + 1);
      }
    }
  }
  // If no full nesting was found, return an empty string
  return "";
}

export function parseTextStructure(t) {
  try {
    const text = t.replace(/\n/g, " ").replace(/\r/g, " ");
    let stack = [];
    let output = {};
    let inString = false;

    const lastKeyPattern = /\[(("\w*\")|\d+)\]=>(?!.*\[(("\w*")|\d+)\]=>)/; //Ostatni występujący w tekście klucz
    const stringValuePattern = /".*?"/; //Pierwszy string po znalezionym typie
    const otherValuePattern = /\((.*?)\)/; //Pierwsza wartość w nawiasach po znalezionym typie
    const arrayTypePattern = /array\(\d*\)/; // typ array z nawiasami

    for (let i = 0; i < text.length; i++) {
      const newText = text.slice(i);
      inString = text.charAt(i) === '"' ? !inString : inString;

      if (!inString) {
        //#region NULL
        if (newText.startsWith("NULL")) {
          const textBeforeINull = text.slice(0, i);
          const keyNull =
            textBeforeINull === ""
              ? null
              : textBeforeINull.match(lastKeyPattern)[1];

          output =
            textBeforeINull === ""
              ? { type: "null", value: null }
              : {
                  ...output,
                  [keyNull]: { type: "null", value: null },
                };
        }
        //#endregion
        //#region string
        if (newText.startsWith("string")) {
          const textBeforeIString = text.slice(0, i);
          const keyString =
            textBeforeIString === ""
              ? null
              : textBeforeIString.match(lastKeyPattern)[1];
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
          //#endregion
          //#region int
        } else if (newText.startsWith("int")) {
          const textBeforeInt = text.slice(0, i);
          const keyInt =
            textBeforeInt === ""
              ? null
              : textBeforeInt.match(lastKeyPattern)[1];
          const intValue = newText.match(otherValuePattern)[1];
          output =
            textBeforeInt === ""
              ? { type: "int", value: parseInt(intValue) }
              : {
                  ...output,
                  [keyInt]: { type: "int", value: parseInt(intValue) },
                };
          //#endregion
          //#region float
        } else if (newText.startsWith("float")) {
          const textBeforeIFloat = text.slice(0, i);
          const keyFloat =
            textBeforeIFloat === ""
              ? null
              : textBeforeIFloat.match(lastKeyPattern)[1];
          const floatValue = newText.match(otherValuePattern)[1];
          output =
            textBeforeIFloat === ""
              ? { type: "float", value: parseFloat(floatValue) }
              : {
                  ...output,
                  [keyFloat]: { type: "float", value: parseFloat(floatValue) },
                };
          //#endregion
          //#region bool
        } else if (newText.startsWith("bool")) {
          const textBeforeIBool = text.slice(0, i);
          const keyBool =
            textBeforeIBool === ""
              ? null
              : textBeforeIBool.match(lastKeyPattern)[1];
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
          //#endregion
          //#region array
        } else if (newText.startsWith("array")) {
          const textBeforeIArr = text.slice(0, i);
          const arrayTypeLength = newText.match(arrayTypePattern)[0]
            ? newText.match(arrayTypePattern)[0].length
            : 0;
          const keyArray =
            textBeforeIArr === ""
              ? null
              : textBeforeIArr.match(lastKeyPattern)[1];
          const arrayContent = extractNestedBrackets(newText);
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
    //#endregion
  } catch (error) {
    console.error("Error parsing text structure:", error);
    return { error: "Failed to parse text structure." };
  }
}

//#region parse object to txt
function parseObjectToOutput(obj, prefix = "") {
  let output = [];
  if (obj.type === "string") {
    return prefix === "" ? ` = ${obj.value}` : `${prefix} = '${obj.value}'`;
  } else if (obj.type !== "string" && obj.type !== "array") {
    return prefix === "" ? ` = ${obj.value}` : `${prefix} = ${obj.value}`;
  } else if (obj.type === "array") {
    for (let key in obj.value) {
      const nestParsValue = parseObjectToOutput(
        obj.value[key],
        `${prefix}[${key}]`
      );
      output.push(nestParsValue);
    }
  }
  return output.join("\n$output");
}
//#endregion
//mozliwosc kopiowania
//nowy projekt, kaledarz googla widok miesiąca, tygodnia i dnia
