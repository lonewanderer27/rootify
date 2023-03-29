import { rowType, rowsType } from "../types";

export function randomTableVal(rows: number): rowsType {
  let myArray: rowType[] = [];

  for(let i = 0; i < rows; i++) {
    myArray.push({
      n: i + 1,
      a: i * 2,
      b: i * 3,
      c: i * 4,
      d: Math.sqrt(i * 4),
      e: Math.abs((i * 2) - (i * 3)),
      less_than_error: (i < 5)
    });
  }

  return myArray;
}