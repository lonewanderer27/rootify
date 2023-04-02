import { REGEXLETTERS } from "../constants";

export function hasInvalidCharacters(str: string) {
  if (REGEXLETTERS.test(str) || str.length === 0) {
    return false
  }
  return true;
}

export function invalidError(str: string) {
  if (
    REGEXLETTERS.test(str) || 
    str.length === 0 || 
    str === "0." || 
    str === "0"
  ) {
    return true;
  } else {
    return false;
  }
}