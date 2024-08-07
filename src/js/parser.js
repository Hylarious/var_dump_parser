export default function parser(text) {
  const stringToParse = text.replace(/\n/g, " ").replace(/\r/g, " "); 
  const object = toArray(text);
  //...
  const result = ""
  console.log(object)
  return object



 // array(4) { ["klucz"]=> string(7) "wartosc" ["klucz_bool"]=> bool(true) ["klucz_float"]=> float(6.34) ["klucz_integer"]=> int(2) }

 //array(3) { ["klucz"]=> string(7) "wartosc" [0]=> array(2) { [0]=> array(3) { ["zagniezdzony_klucz"]=> string(8) "array(3)" ["zagniezdzony_bool"]=> bool(true) ["zagniezdzony_float"]=> float(6.34) } [1]=> array(3) { ["zagniezdzony_klucz"]=> string(21) "zagniezdzona_wartosc2" ["zagniezdzony_bool"]=> bool(false) ["zagniezdzony_float"]=> float(1.34) } } ["moje_liczby"]=> array(5) { [0]=> int(3) [1]=> int(4) [2]=> int(1) [3]=> int(5) [4]=> int(7) } }

}
function toArray(varDumpStr) {
  const obj = {};
  
  // Wyrażenie regularne do znajdywania kluczy w stringu
  const keyPatternRegEx = new RegExp('\\[(.+?)\\]', 'g')
  let match;
  const keys = []

  while ((match = keyPatternRegEx.exec(varDumpStr)) !== null) {
    const key = match[1].replace(/[|]|"/g, '')
    const keyValuePattern = new RegExp(`\\${key}[^{\\[]*[\\}\\[]`, 'g');
    const typeValue = varDumpStr.match(keyValuePattern)[0].replace(new RegExp(`\\${key}|\\n|=>|}|\\[|\\]|\\s`, 'g'), "").replace('"',"")
    let type = ""
    let value = ""
    switch(typeValue) {
      case typeValue.startsWith(' string'):  {
        type = "string"; 
        value = typeValue.slice(typeValue.indexOf('"'), typeValue.lastIndexOf('"') )
        console.log("tv:", typeValue, "v:", value, "t", type)
      }
      // case typeValue.starsWith('float'): 
      // case typeValue.starsWith('int'): 
      // case typeValue.starsWith('bool'): 
      default: break
    }

    
    keys.push(key)
    

      // const valueType = match[2];
      // const value = match[4];
      // // Konwersja wartości na odpowiedni typ
      // if (valueType === 'string') {
      //     obj[key] = value;
      // } else if (valueType === 'int') {
      //     obj[key] = parseInt(value, 10);
      }
      // Można dodać inne typy danych, jak boolean, float, itp.
  // for (let key of keys) {
  //   const keyValuePattern = new RegExp(`\\(${key[1]})[^\{\[]*[{\[]\\`, 'g')
  //   let match2
    
  //   while ((match2 = keyValuePattern.exec(varDumpStr)) !== null) {
  //     valueFromKey 
  //   console.log(match2)
    // }
    
  // }
  
  return obj;
}
  // const regex = /(\[\"\w*\"\]=>.\w*\(([^)]+)\)).\"\w*\"|(\[\"\w*\"\]=>.\w*\(([^)]+)\))/g;

  // const matches = [];
  //   let match;

  //   // Iterate through all matches
  //   while ((match = regex.exec(str)) !== null) {
  //       matches.push(match[0]);
        
  //     }
  //     console.log(matches)
  //   return matches;



