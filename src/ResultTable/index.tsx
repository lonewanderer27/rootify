import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { functionTypeEnums, methodTypeEnums } from "../enums";
import { rowType, rowsType } from "../types";

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { nanoid } from 'nanoid'
import { styled } from "@mui/material";
import { tableCellClasses } from '@mui/material/TableCell';

export default function ResultTable(props: {
  rows: rowsType, 
  funcType?: functionTypeEnums,
  customFunc?: string,
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
      color: theme.palette.info.contrastText,
      backgroundColor: theme.palette.warning.main
    },
  }));

  const headers = {
    bisection: [
      'n',
      'a',
      'b',
      'c = (a + b) / 2',
      `f(c) ${props.funcType === functionTypeEnums.LogFunction ? "= ln(x+1)" : `= ${props.customFunc}`}`,
      '| a - b |',
      '< E'
    ],
    newton: [
      'n',
      'Xn',
      `f(Xn) ${props.funcType === functionTypeEnums.LogFunction ? "= 1/(x+1)" : `= ${props.customFunc}`}`,
      `f'(Xn) ${props.funcType === functionTypeEnums.LogFunction ? "= ln(x+1)" : `= ${props.customFunc}`}`,
      'Xn + 1',
      '| Xn+1 - Xn |',
      '< E'
    ]
  }
  
  const getHeader = (): string[] => {
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
    </Paper>
    
  )
}