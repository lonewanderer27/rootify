import { evaluate, parser } from "mathjs";

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