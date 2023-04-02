import { answerType, rowType } from "../types";
import { derivative, parser } from "mathjs";

import { functionTypeEnums } from "../enums";

/**
 * Calculates the roots of a function using the Newton-Raphson method.
 * @param xn The initial value of x to start the calculations from.
 * @param funcType The type of function to be used in the calculations.
 * @param customFunc The custom function to be used if `funcType` is `functionTypeEnums.AnyFunction`.
 * @param iterations The maximum number of iterations to perform.
 * @param error The maximum allowable error between iterations.
 * @returns {rowType[]} An array of `rowType` objects containing the intermediate results of each iteration.
 */
export default function calcNewton(
  xn: number,
  funcType: functionTypeEnums,
  customFunc: string,
  iterations: number,
  error: number
): answerType {
  // Create a parser instance
  const p = parser();
    // Parsing the user-defined function string and setting it as 'f' for use later
  p.evaluate(customFunc);
  const useCustomFunc = p.get('f');
  // Calculate the first derivative of the custom function
  const firstDerivative = derivative(customFunc, 'x');

  // Initialize the rows array
  let rows: rowType[] = [];

  // Declare temporary variables and initialize them with default values
  let temp_n = 0;             // Iteration number
  let temp_a = xn;            // Initial value of x
  let temp_b = 0;             // Value of f(x)
  let temp_c = 0;             // Value of f'(x)
  let temp_d = 0;             // New value of x
  let temp_e = 0;             // Absolute error
  let temp_less_than_error = temp_e < error; // Boolean value indicating whether error is less than tolerance

  // Loop for a specified number of iterations or until the absolute error is less than the tolerance
  let i = 0
  while (i < iterations){
    console.log(`Loop ${i+1}`)

    // Update iteration number
    temp_n = i+1;

    if (i === 0){
      // Use the initial value of x for the first iteration
      temp_a = xn;
    } else {
      // Use the new value of x from the previous iteration
      temp_a = temp_d;
    }

    if (funcType === functionTypeEnums.AnyFunction){
      // Evaluate f(x) and f'(x) for a custom function
      temp_b = useCustomFunc(temp_a);     
      temp_c = firstDerivative.evaluate({x: temp_a});
    } else {
      // Evaluate f(x) and f'(x) for the default function
      temp_b = Math.log(temp_a+1);
      temp_c = 1 / (temp_a+1);
    }

    // Calculate the new value of x
    temp_d = temp_a - (temp_b / temp_c);
    // Calculate the absolute error
    temp_e = Math.abs(temp_d - temp_a);
    // Check if the absolute error is less than the tolerance
    temp_less_than_error = temp_e < error

    // Create a new row object with the temporary variables
    const row: rowType = {
      n: temp_n,
      a: temp_a,
      b: temp_b,
      c: temp_c,
      d: temp_d,
      e: temp_e,
      less_than_error: temp_less_than_error
    }

    // print the intermediate results for checking
    console.table(row);

    // Add the row object to the rows array
    rows.push(row);
    
    // Incrementing the iteration counter
    i++;

    // Exit the loop if the absolute error is less than the tolerance
    if (temp_less_than_error) {
      break;
    }
  }

  // compute the final answers
  const cn = rows.slice(-1)[0].a;                 
  const f_cn = useCustomFunc(cn);

  // Return the rows array along with the final answers
  return {
    cn: cn,
    f_cn: f_cn,
    rows: rows
  }
}
