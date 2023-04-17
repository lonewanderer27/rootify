import { functionTypeEnums } from "../enums";
import { parser } from "mathjs";
import { rowType } from "../types";

export default function calcSecant(
  xn_1: number,
  xn: number,
  funcType: functionTypeEnums,
  customFunc: string,
  iterations: number,
  error: number
) {
  const p = parser();
  p.evaluate(customFunc);
  const useCustomFunc = p.get("f");
  
  let rows: rowType[] = [];
  let temp_n = 0;

  let temp_a = 0;
  let temp_b = 0;
  let temp_c = 0;
  let temp_d = 0;
  let temp_e = 0;
  let temp_f = 0;

  let temp_less_than_error = temp_e < error;

  let i = 0;
  while (i < iterations) {
    console.log(`Loop ${i + 1}`);

    // Updating the iteration number
    temp_n = i + 1;

    if (i === 0) {
      temp_a = xn_1;
      temp_b = xn;
    } else {
      temp_a = temp_b;
      temp_b = temp_e;
    }

    if (funcType === functionTypeEnums.AnyFunction) {
      temp_c = useCustomFunc(temp_a);
      temp_d = useCustomFunc(temp_b);
    } else {
      temp_c = Math.log(temp_a + 1);
      temp_d = Math.log(temp_b + 1);
    }

    temp_e = temp_b - temp_d * ((temp_b-temp_a)/(temp_d-temp_c))
    temp_f = Math.abs(temp_e-temp_b)
    temp_less_than_error = temp_f < error

    const row: rowType = {
      n: temp_n,
      a: temp_a,
      b: temp_b,
      c: temp_c,
      d: temp_d,
      e: temp_e,
      f: temp_f,
      less_than_error: temp_less_than_error
    }

    console.table(row)

    rows.push(row)

    i++;

    if (temp_less_than_error) {
      break;
    }
  }
  
  const cn = rows.slice(-1)[0].e!
  let f_cn = 0;
  if (funcType === functionTypeEnums.AnyFunction) {
    f_cn = useCustomFunc(rows.slice(-1)[0].c);
  } else {
    f_cn = Math.log(rows.slice(-1)[0].c);
  }

  return {
    cn: cn,
    f_cn: f_cn,
    rows: rows
  }
}