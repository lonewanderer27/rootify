import TableCell, { tableCellClasses } from "@mui/material/TableCell";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { bisectionTableRows } from "../types";
import { nanoid } from "nanoid";
import { styled } from "@mui/material/styles";

export default function PreviewTable(props: {
  rows: bisectionTableRows
}) {
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
      // color: theme.palette.info.contrastText,
      // backgroundColor: theme.palette.action.hover
    },
  }));

  const headers = {
    bisection: [
      'n', 
      'a',
      'b',
      'Error'
    ]
  }

  return (
    <TableContainer sx={{ maxHeight: '50vh' }}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.bisection.map((value) => <TableCell key={nanoid()}>{value}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <StyledTableRow key={nanoid()}>
              <StyledTableCell>{row.n}</StyledTableCell>
              <StyledTableCell>{row.a}</StyledTableCell>
              <StyledTableCell>{row.b}</StyledTableCell>
              <StyledTableCell>{row.error}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}