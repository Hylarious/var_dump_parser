export default function parser(text) {
  // const stringToParse = text.replace(/\n/g, " ").replace(/\r/g, " ");
  const object = parseTextStructure(text);
  //...
  const result = "will be added";
  console.log(object);
  return result;

  // array(4) { ["klucz"]=> string(7) "wartosc" ["klucz_bool"]=> bool(true) ["klucz_float"]=> float(6.34) ["klucz_integer"]=> int(2) }

  //array(3) { ["klucz"]=> string(7) "wartosc" [0]=> array(2) { [0]=> array(3) { ["zagniezdzony_klucz"]=> string(8) "array(3)" ["zagniezdzony_bool"]=> bool(true) ["zagniezdzony_float"]=> float(6.34) } [1]=> array(3) { ["zagniezdzony_klucz"]=> string(21) "zagniezdzona_wartosc2" ["zagniezdzony_bool"]=> bool(false) ["zagniezdzony_float"]=> float(1.34) } } ["moje_liczby"]=> array(5) { [0]=> int(3) [1]=> int(4) [2]=> int(1) [3]=> int(5) [4]=> int(7) } }
}

function parseTextStructure(text) {
  let stack = [];
  let currentPath = [];
  let output = {};

  // dodawanie do obiektu

  let i = 0;

  while ((i < text.length, i < 300)) {
    console.log(text[i], currentPath, stack);
    text = text.trim(); // Trimming the text ensures we skip any unnecessary whitespace
    const arrayPattern = /\barray\s*\(\s*(\S*)\s*\)\s*/;
    if (arrayPattern.test(text.slice(i))) {
      stack.push([]);
      if (currentPath.length > 0) {
        currentPath.push(currentPath[currentPath.length - 1]);
      }
      i = text.indexOf("(", i) + 1; // Skip to the '(' after 'array'
    } else if (text[i] === "}") {
      if (stack.length > 0) {
        let completedArray = stack.pop();
        if (currentPath.length > 0) {
          let lastKey = currentPath.pop();
          setValueAtPath(currentPath, lastKey, completedArray);
        } else {
          output = completedArray;
        }
      }
      i++;
    } else if (text[i] === "[") {
      let endKey = text.indexOf("]", i);
      let key = text.slice(i + 1, endKey).replace(/["']/g, "");
      i = endKey + 1;

     

      if (text[i] === ">"|| text[i] === " " || text[i] === "=") i++;

      //swichcase

    }
  }
  console.log(output);
  return output;
}

// function toObject(varDumpStr) {
//   const obj = {};

// /* zdefiniować stack
// do momentu warunku, który sprawia, że trzbe się cofność, tworzymy stack
// potem redefinuijemy od momentu kiedy trzeba sie wrócić
//  */

//   // Wyrażenie regularne do znajdywania kluczy w stringu
//   const keyPatternRegEx = new RegExp('\\[(.+?)\\]', 'g')
//   let match;
//   const keys = []

//   while ((match = keyPatternRegEx.exec(varDumpStr)) !== null) {
//     const key = match[1].replace(/[|]|"/g, '')
//     const keyValuePattern = new RegExp(`\\[${key}[^{\\[]*[\\}\\[]`, 'g');
//     console.log(key)
//     const typeValue = varDumpStr.match(keyValuePattern)[0].replace(new RegExp(`\\${key}|\\n|=>|}|\\[|\\]|\\s`, 'g'), "").replace('"',"") //dodać warunwk dla braku
//     let type = ""
//     let value = ""
//     const typeTag = typeValue.substring(0,3)
//     console.log( varDumpStr.match(keyValuePattern))
//     switch(typeTag) {
//       case 'str' :  {
//         type = "string";
//         value = typeValue.slice(typeValue.indexOf('"')+1, typeValue.lastIndexOf('"') )
//         console.log("tv:", typeValue, "k:", key, "v:", value, "t:", type)
//         //dodawanie do obiektu
//         break
//       }
//       case 'flo' : {
//         type= 'float';
//         value = typeValue.slice(typeValue.indexOf('(')+1, typeValue.lastIndexOf(')'))
//         console.log("float:", typeValue, "v:", parseFloat(value), "t:", type)
//         //dodawanie do obiektu
//         break
//       }
//       case "int": {
//         type= 'number';
//         value = typeValue.slice(typeValue.indexOf('(')+1, typeValue.lastIndexOf(')'))
//         console.log("float:", typeValue, "v:", parseInt(value), "t:", type)
//         break
//       }
//       case 'boo': {
//         type= 'boolean';
//         value = typeValue.slice(typeValue.indexOf('(')+1, typeValue.lastIndexOf(')')) == 'true' ? true : false
//         console.log("float:", typeValue, "v:", value , "t:", type)
//         break
//       }
//       default: console.log('nomatch')

//     }

//     keys.push(key)

//       // const valueType = match[2];
//       // const value = match[4];
//       // // Konwersja wartości na odpowiedni typ
//       // if (valueType === 'string') {
//       //     obj[key] = value;
//       // } else if (valueType === 'int') {
//       //     obj[key] = parseInt(value, 10);
//       }
//       // Można dodać inne typy danych, jak boolean, float, itp.
//   // for (let key of keys) {
//   //   const keyValuePattern = new RegExp(`\\(${key[1]})[^\{\[]*[{\[]\\`, 'g')
//   //   let match2

//   //   while ((match2 = keyValuePattern.exec(varDumpStr)) !== null) {
//   //     valueFromKey
//   //   console.log(match2)
//     // }

//   // }

//   return obj;
// }
//   // const regex = /(\[\"\w*\"\]=>.\w*\(([^)]+)\)).\"\w*\"|(\[\"\w*\"\]=>.\w*\(([^)]+)\))/g;

//   // const matches = [];
//   //   let match;

//   //   // Iterate through all matches
//   //   while ((match = regex.exec(str)) !== null) {
//   //       matches.push(match[0]);

//   //     }
//   //     console.log(matches)
//   //   return matches;
