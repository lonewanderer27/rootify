import { parser } from "mathjs";

/**
 * Formats a given function string to include the variable letter specified as a parameter.
 * If the string already includes "f(x)", "f(Xn)", or "f'(Xn)", it is returned as is.
 * Otherwise, the function string is formatted as "f(variableLetter) = functionString".
 * 
 * @param funcString - The original function string to format.
 * @param letterVar - The variable letter to include in the formatted function string.
 * @returns The formatted function string.
 */
export function formatFunc(funcString: string, letterVar: string){
  let formattedFunction = ""
  if (funcString.includes("f(x)") || funcString.includes("f(Xn)") || funcString.includes("f'(Xn)")) {
    formattedFunction = funcString;
  }
  else {
    formattedFunction = `f(${letterVar}) = ${funcString}`
  }

  console.log("Formatted Function: "+formattedFunction)
  return formattedFunction;
}

/**
 * Tests if a given function string is valid by evaluating it with a sample number.
 * 
 * @param funcString - The function string to test.
 * @param sampleNum - A sample number to use for evaluating the function string.
 * @returns `true` if the function string is valid, `false` otherwise.
 */
export function testFunc(funcString: string, sampleNum: number = 1) {
  const p = parser();
  try {
    p.evaluate(funcString)
    const testFunc = p.get('f')
    testFunc(sampleNum)
    return true;
  } catch {
    return false;
  }
}
