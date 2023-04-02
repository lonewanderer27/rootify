import { Alert, AlertTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { functionTypeEnums, methodTypeEnums } from "../enums";

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { MathNode } from "mathjs";
import { nanoid } from 'nanoid'
import { rowsType } from "../types";
import { styled } from "@mui/material";
import { tableCellClasses } from '@mui/material/TableCell';

export default function ResultTable(props: {
  rows: rowsType, 
  cn: number,
  f_cn: number,
  funcType?: functionTypeEnums,
  customFunc?: string,
  firstDerivativeFunc?: MathNode,
  methodType: methodTypeEnums,
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

  const headers = {
    bisection: [
      'Iteration',
      'a',
      'b',
      'c = (a + b) / 2',
      props.funcType === functionTypeEnums.LogFunction ? "f(c) = ln(x+1)" : props.customFunc,
      '| a - b |',
      '< E'
    ],
    newton: [
      'Iteration',
      'Xn',
      props.funcType === functionTypeEnums.LogFunction ? "f(Xn) = ln(x+1)" : props.customFunc,
      props.funcType === functionTypeEnums.LogFunction ? "f'(Xn) = 1/(x+1)" :  `f'(Xn) = ${props.firstDerivativeFunc}`,
      'Xn + 1',
      '| Xn+1 - Xn |',
      '< E'
    ]
  }
  
  const getHeader = (): any[] => {
    if (props.methodType === methodTypeEnums.Bisection){
      return headers.bisection
    } else {
      return headers.newton
    }
  }

  return (
    <Paper sx={{width: '100%', overflow: 'hidden'}}>
      <TableContainer>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              {getHeader().map((value) => <StyledTableCell key={nanoid()}>{value}</StyledTableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map((row) => {
              return (
                <StyledTableRow key={nanoid()}>
                  <StyledTableCell key={nanoid()}>{row.n}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.a}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.b}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.c}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.d}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.e}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.less_than_error === true ? <CheckIcon/> : <CloseIcon/>}</StyledTableCell>
                </StyledTableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {props.rows.slice(-1)[0].less_than_error === false && 
      <Alert severity="info">
        <AlertTitle>Root not (yet) found</AlertTitle>
        We still haven't reached the root on iteration {props.rows.length}. <br/>
        Click the REDO button below, increase the maximum number of iterations, then try again.
      </Alert>}
      {props.rows.slice(-1)[0].less_than_error === true && 
      <Alert severity="success">
        <AlertTitle>Less than E at iteration {props.rows.length}!</AlertTitle><br/>
        <AlertTitle>Final Answer: </AlertTitle>
          Cn = {props.cn}<br/>
          f(Cn) = {props.f_cn}
      </Alert>}
    </Paper>
    
  )
}