import { Button, Collapse, FormControlLabel, Paper, Radio, RadioGroup, Slide, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, styled, tableCellClasses } from "@mui/material";
import { PlusOne, PlusOneOutlined } from "@mui/icons-material";
import { bisectionDataError2, bisectionTableData, bisectionTableDataError, bisectionTableRows } from "../types";
import { calcBisectionTable, testBisectionInterval } from "../calculators/bisection";
import { defaultScreenCSS, drawerWidth, inputWidth } from "../App";
import { hasInvalidCharacters, invalidError } from "../Checkers";
import { useRef, useState } from "react";

import Box from "@mui/material/Box";
import { Item } from ".";
import PreviewTable from "../PreviewTable";
import RedoBtn from "../Buttons/RedoBtn";
import RemoveIcon from '@mui/icons-material/Remove';
import SolveBtn from "../Buttons/SolveBtn";
import Typography from "@mui/material/Typography";
import { functionTypeEnums } from "../enums";
import { nanoid } from "nanoid";
import { testFunc } from "../calculators/misc";
import { useEffect } from "react";

export function BisectionTable() {
  const defaultRow = {
    a: "",
    b: "",
    n: 0,
    error: ""
  }

  const defaultErrorRow = {
    a: "",
    b: "",
    n: "",
    error: "",
    func: ""
  }

  const defaultTableData = {
    funcType: functionTypeEnums.LogFunction,
    standardMethod: true,
    customFunc: "",
  }

  const defaultDataError = {
    func: ""
  }

  const [basicInputRows, setBasicInputRows] = useState<string>(() => "");
  const [useBasicInput, setUseBasicInput] = useState(() => true);
  const [BIHasError, setBIHasError] = useState(() => false);

  const [showAnswer, setShowAnswer] = useState(() => false);
  const [data, setData] = useState<bisectionTableData>(() => defaultTableData);
  const [dataError, setDataError] = useState<bisectionDataError2>(() => defaultDataError)
  const [tableDataError, setTableDataError] = useState<bisectionTableDataError>(() => (Array(5).fill(defaultErrorRow)))
  const [rows, setRows] = useState<bisectionTableRows>(() => (Array(5).fill(defaultRow)))

  const currentInputRef = useRef(null);

  useEffect(() => {
    const bisectionBasicInput = localStorage.getItem("rootify--bisectionTableBasicInput");
    if (bisectionBasicInput !== null) {
      setBasicInputRows(() => bisectionBasicInput);
    } else {
      setBasicInputRows(() => "0;0;0;0;\n0;0;0;0;\n0;0;0;0;\n0;0;0;0;\n0;0;0;0;");
    }
    const bisectionData = localStorage.getItem("rootify--bisectionTableData");
    if (bisectionData !== null) {
      setData(() => JSON.parse(bisectionData));
    }

  }, [])

  const resetErrors = () => {
    setDataError(() => ({func: ""}))
    setTableDataError(() => ([defaultErrorRow]))
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

  const addRow = () => {
    // add new row data
    setRows((prev) => {
      console.log("Previous Rows")
      console.log(prev)
      const newRow = [...prev, defaultRow]
      console.log("New Rows")
      console.log(newRow)
      return newRow
    })

    // add new data error table
    setTableDataError((prev) => {
      console.log("Previous Rows");
      console.log(prev);
      const newRow = [...prev, defaultErrorRow]
      console.log("New Rows")
      console.log(newRow)
      return newRow
    })
  }

  const removeRow = (index: number) => {
    setRows((prev) => {
      return prev.filter((_, i) => i !== index)
    })
  }

  const headers = [
    "n",
    "a",
    "b",
    "< Error",
    ""
  ]

  useEffect(() => {
    if (currentInputRef.current !== null) {
      console.log(`Focusing input on ${currentInputRef.current?.name}`)
      currentInputRef.current?.focus();
    }
  }, [data, rows])

  const toggleUseBasicInput = () => setUseBasicInput((prev) => !prev)

  const handleBasicInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBIHasError(() => false)

    const { value } = event.target;
    try {
      const rows = value.split("\n").map(row => row.split(/[;, ]+/));

      const transformed = []
      for (const row of rows) {
        const obj = {
          n: Number(row[0]),
          a: Number(row[1]),
          b: Number(row[2]),
          error: Number(row[3]),
        };
        transformed.push(obj);
      }
      
      console.log("Transformed Data")
      console.table(transformed);

      setBasicInputRows(() => value);
      localStorage.setItem("rootify--bisectionTableBasicInput", value);

      setRows(() => transformed);
    } catch (err) {
      setBIHasError(() => true)
      console.log("Error transforming basic input data")
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const customName = event.target.name.split("-")[1];
    const index = Number(event.target.name.split("-")[0]);
    const { name, value, type, checked } = event.target;

    if (name === "funcType" || name === "customFunc" || name === "standardMethod") {
      setData((prev) => {
        console.log("Prev Data")
        console.table(prev)
        
        let newData = {
          ...prev,
          [name]: type === "checkbox" ? checked : value
        }
        console.log("New Data")
        console.table(newData)
        
        return newData;
      })
    } else {
      console.log(`${index}-${customName} tries to change its value to ${value}`)
      setRows((prev) => {
        console.log("Prev Rows")
        console.table(prev)

        let newRows = [...prev]
        newRows[index] = {
          ...prev[index],
          [customName]: value
        }
        console.log("New Rows")
        console.table(newRows)
        
        return newRows;
      })
    }
  }

  const toggleShowAnswer = () => setShowAnswer((prev) => !prev)

  const verifyDataInputs = (data: bisectionTableData) => {
    resetErrors();

    if (data.funcType === functionTypeEnums.AnyFunction && 
      testFunc(data.customFunc) === false
    ) {
    setDataError(() => ({
      func: "Invalid function"
    }))
    }
  }

  const verifyRowInputs = (rows: bisectionTableRows) => {
    resetErrors();

    let errorArr: bisectionTableDataError = [defaultErrorRow]

    rows.forEach((row, index) => {
      if (row.a === row.b) {
        errorArr[index].a = "Needs to be different from b"
        errorArr[index].b = "Needs to be different from a"
      } else {
        if (hasInvalidCharacters(row.a) === true) {
          errorArr[index].a = "Invalid number"
        }
  
        if (hasInvalidCharacters(row.b) === true) {
          errorArr[index].b = "Invalid number"
        }
      }

      if (row.n < 0 || row.n > 100) {
        errorArr[index].n = "n must be between 0 and 100"
      }

      if (invalidError(row.error) === true) {
        errorArr[index].error = "Invalid error"
      }

      const res = testBisectionInterval(
        parseFloat(row.a), 
        parseFloat(row.b), 
        data.funcType, 
        data.customFunc
      )

      if (res.success === false) {
        setTableDataError((prev) => ({
          ...prev,
          func: res.errorMessages
        }))
      }
    })

    setTableDataError(() => errorArr)
  }

  const getResultTable = () => {
    const result = calcBisectionTable(rows, data);

    console.log("TABLE RESULT: ")
    console.table(result)
  }

  showAnswer && getResultTable()

  const tableBodyRef = useRef(null);

  console.log("Data: ")
  console.table(data)
  console.log("Rows")
  console.table(rows)

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, width: {xs: `calc(100% - ${drawerWidth}px)` }, ...defaultScreenCSS }}
    >
      <Toolbar/>
      <Stack spacing={2}>
        <Item variant="outlined">
          <Typography variant="h6" color="InfoText">Choose a function</Typography>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: { xs: 0, sm: 1 }, width: inputWidth },
            }}
            autoComplete="off"
          >
            <>
              <RadioGroup
                row
                onChange={handleChange}
                value={data.funcType}
              >
                <FormControlLabel 
                  name="funcType"
                  value={functionTypeEnums.LogFunction}
                  control={<Radio/>} 
                  label="ln(x+1)" 
                  disabled={showAnswer}
                />
                <FormControlLabel 
                  name="funcType"
                  value={functionTypeEnums.AnyFunction} 
                  control={<Radio/>}
                  label="Custom" 
                  disabled={showAnswer}
                />
                <Collapse 
                  in={data.funcType === functionTypeEnums.AnyFunction} 
                  orientation="horizontal"
                >
                  {data.funcType === functionTypeEnums.AnyFunction && <TextField
                    disabled={showAnswer}
                    name="customFunc"
                    id="input--func"
                    label="Format: f(x) = <Function>"
                    value={data.customFunc}
                    variant="standard"
                    onChange={handleChange} 
                  />}
                </Collapse>
              </RadioGroup>
              {dataError.func.length !== 0 && (
                <Typography variant="caption" display="block" sx={{ color: "red" }} gutterBottom>
                  {dataError.func}
                </Typography>
              )}
            </>
          </Box>         
        </Item>
        <Item variant="outlined">
          <Typography variant="h6" color="InfoText">Fill in the known values in the table</Typography>
          {useBasicInput === false && <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (<StyledTableCell key={nanoid()}>{header}</StyledTableCell>))}
                  </TableRow>
                </TableHead>
                <TableBody ref={tableBodyRef}>
                  {rows.map((row, index) => (
                    <Slide key={`${index}-slide`} direction="up" in={true} container={tableBodyRef.current} mountOnEnter unmountOnExit>
                      <StyledTableRow key={`${index}-trow`}>
                        <StyledTableCell key={`${index}-tcell-column1`}>
                          <TextField
                            ref={currentInputRef.current !== null && `${index}-a` === currentInputRef.current.name ? currentInputRef : null}
                            error={tableDataError[index].n !== "" && true}
                            helperText={tableDataError[index].n !== "" && tableDataError[index].n}
                            disabled={showAnswer}
                            key={`${index}-n`}
                            name={`${index}-n`} 
                            type="number"
                            id={`${index}-n`}
                            label="Value of iteration"
                            variant="standard"
                            value={row.n}
                            onChange={handleChange}
                            onFocus={(e) => {currentInputRef.current = e.target}}
                          />
                        </StyledTableCell>
                        <StyledTableCell key={`${index}-tcell-column2`}>
                          <TextField
                            ref={currentInputRef.current !== null && `${index}-a` === currentInputRef.current.name ? currentInputRef : null}
                            error={tableDataError[index].a !== "" && true}
                            helperText={tableDataError[index].a !== "" && tableDataError[index].a}
                            disabled={showAnswer}
                            key={`${index}-a`}
                            name={`${index}-a`} 
                            id={`${index}-a`}
                            label="Value of a"
                            value={row.a}
                            variant="standard"
                            onChange={handleChange}
                            onFocus={(e) => {currentInputRef.current = e.target}}
                          />
                        </StyledTableCell>
                        <StyledTableCell key={`${index}-tcell-column3`}>
                          <TextField
                            ref={currentInputRef.current !== null && `${index}-a` === currentInputRef.current.name ? currentInputRef : null}
                            error={tableDataError[index].b !== "" && true}
                            helperText={tableDataError[index].b !== "" && tableDataError[index].b}
                            disabled={showAnswer}
                            key={`${index}-b`}
                            name={`${index}-b`}
                            id={`${index}-b`}
                            label="Value of b"
                            value={row.b}
                            data-index={`${index}`} 
                            variant="standard"
                            onChange={handleChange}
                            onFocus={(e) => {currentInputRef.current = e.target}}
                          />
                        </StyledTableCell>
                        <StyledTableCell key={`${index}-tcell-column4`}>
                          <TextField
                            ref={currentInputRef.current !== null && `${index}-a` === currentInputRef.current.name ? currentInputRef : null}
                            error={tableDataError[index].error !== "" && true}
                            helperText={tableDataError[index].error !== "" && tableDataError[index].error}
                            disabled={showAnswer}
                            key={`${index}-error`}
                            name={`${index}-error`} 
                            id={`${index}-error`}
                            label="Value of error"
                            value={row.error}
                            data-index={`${index}`} 
                            variant="standard"
                            onChange={handleChange}
                            onFocus={(e) => {currentInputRef.current = e.target}}
                          />
                        </StyledTableCell>
                        <StyledTableCell key={`${index}-tcell-column5`}>
                          {index !== 0 && <Button 
                            color="warning" 
                            variant="contained" 
                            onClick={() => removeRow(index)}
                          >
                            <RemoveIcon key={`${index}-removeIcon`}/>
                          </Button>}
                        </StyledTableCell>
                      </StyledTableRow>
                    </Slide>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Collapse in={!showAnswer}>
              <Button variant="contained" endIcon={<PlusOneOutlined/>} onClick={() => addRow()} sx={{m: 4}}>
                Add Row
              </Button>
            </Collapse>
          </Paper>}
          {useBasicInput === true && <>
            <TextField 
              error={BIHasError}
              value={basicInputRows}
              helperText={BIHasError && "Please enter the values in the correct format"}
              label="n; a; b; error;"
              multiline
              rows={5}
              variant="standard"
              onChange={handleBasicInputChange}
            />
            <PreviewTable rows={rows} />
          </>}
        </Item>
        <Collapse in={!showAnswer}>
          <SolveBtn handleClick={toggleShowAnswer} />
        </Collapse>
        <Collapse in={showAnswer}>
          <RedoBtn handleClick={toggleShowAnswer} />
        </Collapse>
      </Stack>
    </Box>
  )
}