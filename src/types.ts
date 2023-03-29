import { functionTypeEnums } from "./enums"

export type bisectionData = {
  a: string,
  b: string,
  funcType: functionTypeEnums,
  customFunc: string,
  iterations: number,
  error: string
}

export type bisectionDataError = {
  a: string,
  b: string,
  customFunc: string,
  iterations: string;
  error: string;
}

export type newtonData = {
  xn: string,
  funcType: functionTypeEnums,
  customFunc: string,
  iterations: number,
  error: string
}

export type newtonDataError = {
  xn: string,
  customFunc: string,
  iterations: string,
  error: string
}

export type rowType = {
  n: number,
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  less_than_error: boolean
}

export type rowsType = rowType[]