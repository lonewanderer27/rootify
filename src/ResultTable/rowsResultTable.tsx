import { Accordion, AccordionDetails, AccordionSummary, IconButton, TableBody, Typography, styled } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { answerType, bisectionTableRows } from "../types";
import { functionTypeEnums, methodTypeEnums } from "../enums";

import { ExpandMore } from "@mui/icons-material";
import { MathNode } from "mathjs";
import Paper from "@mui/material/Paper";
import ResultTable from ".";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { nanoid } from "nanoid";

export function RowsResultTable(props: {
  funcType: functionTypeEnums,
  customFunc?: string,
  firstDerivativeFunc?: MathNode
  bisectionRows?: answerType[],
  methodType: methodTypeEnums
}) {
  const headers = {
    bisection: [
      'n',
      'a',
      'b',
      'Error',
      'Cn',
      'f(Cn)'
    ],
    newton: [
      'n',
      'Error',
      'Cn',
      'f(Cn)',
    ]
  }

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
      backgroundColor: theme.palette.action.hover
    },
  }));

  return (
    <Paper sx={{width: '100%'}}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headers.bisection.map((value) => <StyledTableCell key={nanoid()}>{value}</StyledTableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.bisectionRows.map((row) => (
              <>
                <StyledTableRow key={nanoid()}>
                  <StyledTableCell key={nanoid()}>1</StyledTableCell>
                  <StyledTableCell key={nanoid()}>1</StyledTableCell>
                  <StyledTableCell key={nanoid()}>1</StyledTableCell>
                  <StyledTableCell key={nanoid()}>1</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.cn}</StyledTableCell>
                  <StyledTableCell key={nanoid()}>{row.f_cn}</StyledTableCell>
                </StyledTableRow>
                <StyledTableRow key={nanoid()}>
                  <StyledTableCell key={nanoid()} colSpan={6}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography>Click to expand the whole table</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <ResultTable
                            displayOneAnswer={false}
                            rows={row.rows}
                            cn={row.cn}
                            f_cn={row.f_cn}
                            funcType={props.funcType}
                            firstDerivativeFunc={props.firstDerivativeFunc}
                            methodType={props.methodType} />
                        </AccordionDetails>
                      </Accordion>
                    </StyledTableCell>
                </StyledTableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}