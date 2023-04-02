import { answerType, rowType, testBisectionIntervalResults } from "../types";

// Importing necessary modules and types
import { functionTypeEnums } from "../enums";
import { parser } from "mathjs";

// Defining the function to test bisection interval
export function testBisectionInterval(
  a: number,
  b: number,
  funcType: functionTypeEnums, 
  customFunc: string,
): testBisectionIntervalResults  {

  // Initializing the response object with default values
  let response: testBisectionIntervalResults = {
    f_a: 0,
    f_a_sign: null,
    f_b: 0,
    f_b_sign: null,
    errorMessages: [],
    success: true
  }

  // Creating an instance of the Math.js parser
  const p = parser();

  // Parsing the user-defined function string and setting it as 'f' for use later
  p.evaluate(customFunc);
  const useCustomFunc = p.get('f');

  // Evaluating the function at point 'a' and 'b'
  if (funcType === functionTypeEnums.AnyFunction) {
    response.f_a = useCustomFunc(a);
    response.f_b = useCustomFunc(b);
  } else {
    // Using the natural logarithm function as default
    response.f_a = Math.log(a+1)
    response.f_b = Math.log(b+1)
  }

  // Setting the signs of f(a) and f(b) for later use
  response.f_a_sign = Math.sign(response.f_a)
  response.f_b_sign = Math.sign(response.f_b)

  // Adding error messages to response object
  response.errorMessages = [
    `f(a) = ${response.f_a}`,
    `f(b) = ${response.f_b}`,
  ]

  // Checking if f(a) or f(b) is 0
  if (response.f_a_sign === 0 || response.f_b_sign === 0) {
    response.errorMessages.push(`f(a) or f(b) cannot have 0 as result`)
    response.success = false;
  } else {
    // Testing if the result have same signs,
    // meaning [+, -] or [-, +]
    if (response.f_a_sign === response.f_b_sign) {
      // If the signs are the same, the test failed, so set success to false
      response.errorMessages.push(`f(a) and f(b) cannot have the same sign which is ${response.f_a_sign === 1 ? "positive" : "negative"}`)
      response.success = false;
    }
  }
  
  // If success is false, add an additional error message to indicate that the chosen function is not applicable to the values of f(a) and f(b)
  if (response.success === false) {
    response.errorMessages.push("Chosen function is not applicable to the values of f(a) and f(b)")
  }
  
  // Return the result of the test
  return response;
}


export default function calcBisection(
  a: number,
  b: number,
  funcType: functionTypeEnums,
  customFunc: string,
  iterations: number,
  error: number,
  standardMethod: boolean
): answerType {
  if (standardMethod) {
    return calcBisectionStandard(
      a,
      b,
      funcType,
      customFunc,
      iterations,
      error
    )
  } else {
    return calcBisectionOld(
      a,
      b,
      funcType,
      customFunc,
      iterations,
      error
    )
  }
}



/**
 * Computes the roots of a given function using the Standard Bisection method found in PPT and Internet
 *
 * @param {number} a - the first initial point that brackets a root of the function
 * @param {number} b - the second initial point that brackets a root of the function
 * @param {functionTypeEnums} funcType - the type of function to be used for the computation
 * @param {string} customFunc - the custom function to be used if `funcType` is set to `AnyFunction`
 * @param {number} iterations - the maximum number of iterations that the method will perform
 * @param {number} error - the maximum error allowed for the approximation
 * @returns {rowType[]} - an array of `rowType` objects that represent the values of the variables at each iteration of the method
 */
export function calcBisectionStandard(
  a: number,
  b: number,
  funcType: functionTypeEnums,
  customFunc: string,
  iterations: number,
  error: number
): answerType {
  // Creating an instance of the Math.js parser
  const p = parser();
  // Parsing the user-defined function string and setting it as 'f' for use later
  p.evaluate(customFunc)
  const useCustomFunc = p.get('f')
  
  // Creating an empty array to store the rows of data generated by the bisection algorithm
  let rows: rowType[] = [];

  // Initializing some temporary variables
  let temp_n = 0; // iteration number

  let temp_a = 0; // lower bound of the interval
  let temp_f_a = 0; // value of function at lower bound

  let temp_b = 0; // upper bound of the interval
  let temp_f_a_f_c = 0; // value of f(a) * f(c)
  
  let temp_c = 0; // midpoint of the interval
  let temp_d = 0; // value of the function at the midpoint
  let temp_e = 0; // absolute difference between temp_a and temp_b
  let temp_less_than_error = temp_e < error; // boolean flag indicating whether the error is less than the desired value

  // Looping through the specified number of iterations
  let i = 0
  while (i < iterations){
    console.log(`Loop ${i+1}`)

    // Updating the iteration number
    temp_n = i+1;

    // If this is the first iteration, use the original interval [a, b]
    if (i === 0){
      temp_a = a;
      temp_b = b;
    } else {
      // if f(a) * f(c) < 0 then use the interval [a, c]
      if (temp_f_a_f_c < 0){
        temp_b = temp_c
      // else use the interval [c, b]
      } else if (temp_f_a_f_c > 0){
        temp_a = temp_c
      }
    }

    // Calculating the midpoint of the interval
    temp_c = (temp_a+temp_b) / 2

    // Calculating the value of the functions at the midpoint, either by using the user-defined function or the natural logarithm
    if (funcType === functionTypeEnums.AnyFunction) {
      temp_d = useCustomFunc(temp_c)
      temp_f_a = useCustomFunc(temp_a);
    } else {
      temp_d = Math.log(temp_c+1);
      temp_f_a = Math.log(temp_a+1);
    }

    // compute the value of f(a) * f(c)
    temp_f_a_f_c = temp_f_a * temp_d

    // Calculating the absolute difference between temp_a and temp_b, and updating the boolean flag
    temp_e = Math.abs(temp_a - temp_b);
    temp_less_than_error = temp_e < error

    // Creating a new row object with all the relevant data for this iteration
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

    // Adding the new row to the array of rows
    rows.push(row)

    // Incrementing the iteration counter
    i++;

    // If the absolute difference is less than the desired error, break out of the loop
    if (temp_less_than_error) {
      break;
    }
  }

  // compute the final answers
  const cn = rows.slice(-1)[0].b;                 
  const f_cn = rows.slice(-1)[0].d;

  // Return the rows array along with the final answers
  return {
    cn: cn,
    f_cn: f_cn,
    rows: rows
  }
}







/**
 * Computes the roots of a given function using the Bisection method taught in the activity
 *
 * @param {number} a - the first initial point that brackets a root of the function
 * @param {number} b - the second initial point that brackets a root of the function
 * @param {functionTypeEnums} funcType - the type of function to be used for the computation
 * @param {string} customFunc - the custom function to be used if `funcType` is set to `AnyFunction`
 * @param {number} iterations - the maximum number of iterations that the method will perform
 * @param {number} error - the maximum error allowed for the approximation
 * @returns {rowType[]} - an array of `rowType` objects that represent the values of the variables at each iteration of the method
 */
export function calcBisectionOld(
  a: number,
  b: number,
  funcType: functionTypeEnums,
  customFunc: string,
  iterations: number,
  error: number
  ): answerType {
  // Creating an instance of the Math.js parser
  const p = parser();
  // Parsing the user-defined function string and setting it as 'f' for use later
  p.evaluate(customFunc)
  const useCustomFunc = p.get('f')
  
  // Creating an empty array to store the rows of data generated by the bisection algorithm
  let rows: rowType[] = [];
  
  // Initializing some temporary variables
  let temp_n = 0; // iteration number
  let temp_a = 0; // lower bound of the interval
  let temp_b = 0; // upper bound of the interval
  let temp_c = 0; // midpoint of the interval
  let temp_d = 0; // value of the function at the midpoint
  let temp_e = 0; // absolute difference between temp_a and temp_b
  let temp_less_than_error = temp_e < error; // boolean flag indicating whether the error is less than the desired value
  
  // Looping through the specified number of iterations
  let i = 0
  while (i < iterations){
    console.log(`Loop ${i+1}`)

    // Updating the iteration number
    temp_n = i+1;

    // If this is the first iteration, use the original interval [a, b]
    if (i === 0){
      temp_a = a;
      temp_b = b;
    } else {
      // Otherwise, use the interval [a, c] if the sign of temp_d is positive, or [c, b] if it's negative
      temp_a = Math.sign(temp_d) === 1 ? temp_c : temp_a;
      temp_b = Math.sign(temp_d) === -1 ? temp_c : temp_b;
    }

    // Calculating the midpoint of the interval
    temp_c = (temp_a+temp_b) / 2

    // Calculating the value of the function at the midpoint, either by using the user-defined function or the natural logarithm
    if (funcType === functionTypeEnums.AnyFunction) {
      temp_d = useCustomFunc(temp_c)
    } else {
      temp_d = Math.log(temp_c+1);
    }

    // Calculating the absolute difference between temp_a and temp_b, and updating the boolean flag
    temp_e = Math.abs(temp_a - temp_b);
    temp_less_than_error = temp_e < error;

    // Creating a new row object with all the relevant data for this iteration
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

    // Adding the new row to the array of rows
    rows.push(row)

    // Incrementing the iteration counter
    i++;

    // If the absolute difference is less than the desired error, break out of the loop
    if (temp_less_than_error) {
      break;
    }
  }

  // compute the final answers
  const cn = rows.slice(-1)[0].b;                 
  const f_cn = useCustomFunc(rows.slice(-1)[0].d);

  // Return the rows array along with the final answers
  return {
    cn: cn,
    f_cn: f_cn,
    rows: rows
  }
}