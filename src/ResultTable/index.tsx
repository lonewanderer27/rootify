import { Alert, AlertTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { functionTypeEnums, methodTypeEnums } from "../enums";
import math, { MathNode } from "mathjs";

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { nanoid } from 'nanoid'
import { rowsType } from "../types";
import { styled } from "@mui/material";
import { tableCellClasses } from '@mui/material/TableCell';

export const replacefx = (functionStr: string | undefined, xvar: string) => {
  return functionStr!.replaceAll('f(x)', `f(${xvar})`)
}

export default function ResultTable(props: {
  displayOneAnswer?: boolean,
  rows: rowsType, 
  cn: number,
  f_cn: number,
  funcType?: functionTypeEnums,
  customFunc?: string,
  firstDerivativeFunc?: MathNode,
  methodType: methodTypeEnums,
  repeating?: boolean
}){
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },

    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
      color: props.rows.slice(-1)[0].less_than_error === false ? null : theme.palette.info.contrastText,
      backgroundColor: props.rows.slice(-1)[0].less_than_error === false ?  theme.palette.action.hover : theme.palette.warning.main
    },
  }));

  const varHeaders = [
    'n','a','b','c','d','e','f', ''
  ]

  const headers = {
    bisection: [
      'n',
      'a',
      'b',
      'c = (a + b) / 2',
      props.funcType === functionTypeEnums.LogFunction ? "f(c) = ln(x+1)" : replacefx(props.customFunc, 'c'),
      '| a - b |',
      '< E'
    ],
    newton: [
      'n',
      'Xn',
      props.funcType === functionTypeEnums.LogFunction ? "f(Xn) = ln(x+1)" : replacefx(props.customFunc, 'Xn'),
      props.funcType === functionTypeEnums.LogFunction ? "f'(Xn) = 1/(x+1)" :  `f'(Xn) = ${props.firstDerivativeFunc}`,
      'Xn + 1',
      '| Xn+1 - Xn |',
      '< E'
    ],
    secant: [
      'n',
      'Xn-1',
      'Xn',
      props.funcType === functionTypeEnums.LogFunction ? "f(Xn-1) = ln(x+1)" : replacefx(props.customFunc, 'Xn-1'),
      props.funcType === functionTypeEnums.LogFunction ? "f(Xn) = ln(x+1)" : replacefx(props.customFunc, 'Xn'),
      'Xn+1',
      '| Xn+1 - Xn |',
      '< E'
    ]
  }

  const getVarHeader = (): any[] => {
    if (props.methodType === methodTypeEnums.Secant) {
      return varHeaders.slice(0, 7).concat([''])
    } else {
      return varHeaders.slice(0, 6).concat([''])
    }
  }
  
  const getHeader = (): any[] => {
    switch(props.methodType){
      case methodTypeEnums.Bisection: return headers.bisection;
      case methodTypeEnums.Newton: return headers.newton;
      case methodTypeEnums.Secant: return headers.secant;
    }
  }

  return (
    <Paper sx={{width: '100%', overflow: 'hidden'}}>
      <TableContainer sx={{ maxHeight: '50vh' }}>
        <Table sx={{ minWidth: 700 }} stickyHeader>
          <TableHead>
            <TableRow>
              {getVarHeader().map((value) => <StyledTableCell key={nanoid()}>{value}</StyledTableCell>)}
            </TableRow>
            <TableRow>
              {getHeader().map((value) => <StyledTableCell key={nanoid()}>{value}</StyledTableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.displayOneAnswer === false && props.rows.map((row) => {
              return (
                <StyledTableRow key={nanoid()}>
                  <StyledTableCell key={nanoid()}>{row.n}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.a}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.b}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.c}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.d}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.e}</StyledTableCell>
                  {props.methodType === methodTypeEnums.Secant && <StyledTableCell key={nanoid()}>{row.f}</StyledTableCell>}
                  <StyledTableCell key={nanoid()}>{row.less_than_error === true ? <CheckIcon/> : <CloseIcon/>}</StyledTableCell>
                </StyledTableRow>
              )
            })}
            {props.displayOneAnswer === true &&
                <StyledTableRow key={nanoid()}>
                  <StyledTableCell key={nanoid()}>{props.rows.slice(-1)[0].n}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{props.rows.slice(-1)[0].a}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{props.rows.slice(-1)[0].b}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{props.rows.slice(-1)[0].c}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{props.rows.slice(-1)[0].d}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{props.rows.slice(-1)[0].e}</StyledTableCell>
                  {props.methodType === methodTypeEnums.Secant && 
                    <StyledTableCell key={nanoid()}>{props.rows.slice(-1)[0].f}</StyledTableCell>}
                  <StyledTableCell key={nanoid()}>{props.rows.slice(-1)[0].less_than_error === true ? <CheckIcon/> : <CloseIcon/>}</StyledTableCell>
                </StyledTableRow>
            }
          </TableBody>
          {}
        </Table>
      </TableContainer>
      {props.rows.slice(-1)[0].less_than_error === false && props.repeating === true &&
      <Alert severity="warning">
        <AlertTitle>Warning</AlertTitle>
        Iterations stopped prematurely since repeated values detected on iteration {props.rows.length}.
      </Alert>}
      {props.rows.slice(-1)[0].less_than_error === false && props.repeating === false &&
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        Less than E is still not true on last iteration ({props.rows.length}). <br/><br/>
        Click the REDO button below, increase the maximum number of iterations, then try again.
      </Alert>}
      {props.rows.slice(-1)[0].less_than_error === true && 
      <Alert severity="success">
        <AlertTitle>Less than E at iteration {props.rows.length}!</AlertTitle><br/>
        <AlertTitle sx={{fontWeight: "bold"}}>Final Answer: </AlertTitle>
          Cn = {props.cn}<br/>
          f(Cn) = {props.f_cn}<br/>
      </Alert>}
    </Paper>
    
  )
}