import { rowType, rowsType } from "../types";

import { functionTypeEnums } from "../enums";

// This function generates an array of random values for a given number of rows
export function randomTableVal(rows: number, funcType?: functionTypeEnums): rowsType {

  // Create an empty array to store the rows
  let myArray: rowType[] = [];

  // Loop through the desired number of rows
  for(let i = 0; i < rows; i++) {

    // Add a new row to the array with random values for each column
    myArray.push({
      n: i + 1,                      // incrementing integer value starting from 1
      a: i * 2,                      // column "a" gets a value equal to 2 times the row index
      b: i * 3,                      // column "b" gets a value equal to 3 times the row index
      c: i * 4,                      // column "c" gets a value equal to 4 times the row index
      d: Math.sqrt(i * 4),           // column "d" gets the square root of 4 times the row index
      e: Math.abs((i * 2) - (i * 3)),// column "e" gets the absolute difference between 2 times the row index and 3 times the row index
      f: (funcType === functionTypeEnums.LogFunction) ? Math.log(i * 4) : undefined, // column "f" gets the natural logarithm of 4 times the row index if the function type is "Log Function"
      less_than_error: (i < 5)       // column "less_than_error" gets a boolean value indicating whether the row index is less than 5
    });
  }

  // Return the completed array
  return myArray;
}
