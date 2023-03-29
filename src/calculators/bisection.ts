import { functionTypeEnums } from "../enums";
import { rowType } from "../types";

export default function calcBisection(
  a: number,
  b: number,
  funcType: functionTypeEnums,
  customFunc: string,
  iterations: number,
  error: number
): rowType[] {
  let rows: rowType[] = [];

  let temp_n = 0;
  let temp_a = 0;
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
      temp_a = a;
      temp_b = b;
    } else {
      temp_a = Math.sign(temp_d) === 1 ? temp_c : temp_a;
      temp_b = Math.sign(temp_d) === -1 ? temp_c : temp_b;
    }

    temp_c = (temp_a+temp_b) / 2
    temp_d = Math.log(temp_c+1);
    temp_e = Math.abs(temp_a - temp_b);
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