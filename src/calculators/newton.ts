import { derivative, parser } from "mathjs";

import { functionTypeEnums } from "../enums";
import { rowType } from "../types";

export default function calcNewton(
  xn: number,
  funcType: functionTypeEnums,
  customFunc: string,
  iterations: number,
  error: number
): rowType[] {
  const p = parser();
  if (customFunc.includes("f(x) =")) {
    p.evaluate(customFunc)
  } else {
    p.evaluate(`f(x) = ${customFunc}`)
  }
  
  const useCustomFunc = p.get('f')
  const firstDerivative = derivative(customFunc, 'x')

  console.log(`customFunction: ${useCustomFunc}`)

  let rows: rowType[] = [];

  let temp_n = 0;
  let temp_a = xn;
  let temp_b = 0;
  let temp_c = 0
  let temp_d = 0
  let temp_e = 0
  let temp_less_than_error = temp_e < error;

  let i = 0
  while (i < iterations){
    console.log(`Loop ${i+1}`)

    temp_n = i+1;

    if (i === 0){
      temp_a = xn;
    } else {
      temp_a = temp_d;
    }

    if (funcType === functionTypeEnums.AnyFunction){
      temp_b = useCustomFunc(temp_a)      
      temp_c = firstDerivative.evaluate({x: temp_a})
    } else {
      temp_b = Math.log(temp_a+1)
      temp_c = 1 / (temp_a+1)
    }

    temp_d = temp_a - (temp_b / temp_c)
    temp_e = Math.abs(temp_d - temp_a);
    temp_less_than_error = temp_e < error;

    const row: rowType = {
      n: temp_n,
      a: temp_a,
      b: temp_b,
      c: temp_c,
      d: temp_d,
      e: temp_e,
      less_than_error: temp_less_than_error
    }
    console.table(row)

    rows.push(row)
    
    i++;

    if (temp_less_than_error) {
      break;
    }
  }

  return rows;
}