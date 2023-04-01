import React, { useEffect, useState } from "react";
import { TableComponents, TableVirtuoso } from 'react-virtuoso';
import { bisectionData, bisectionDataError } from "../types";
import { drawerWidth, inputWidth } from "../App";
import { formatFunc, testFunc } from "../calculators/misc";
import { functionTypeEnums, methodTypeEnums } from "../enums";

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip"
import Collapse from '@mui/material/Collapse';
import FormControlLabel from "@mui/material/FormControlLabel"
import Paper from '@mui/material/Paper';
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import RedoBtn from "../Buttons/RedoBtn";
import ResultTable from "../ResultTable";
import SolveBtn from "../Buttons/SolveBtn";
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import calcBisection from "../calculators/bisection";
import { styled } from '@mui/material/styles';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

export default function Bisection() {
  const [showAnswer, setShowAnswer] = useState(() => false);
  const [data, setData] = useState<bisectionData>(() => ({
    a: "",
    b: "",
    funcType: functionTypeEnums.LogFunction,
    customFunc: "",
    iterations: 0,
    error: ""
  }));
  const [dataError, setDataError] = useState<bisectionDataError>(() => ({
    a: "",
    b: "",
    customFunc: "",
    iterations: "",
    error: ""
  }));

  useEffect(() => {
    const bisectionData = JSON.parse(localStorage.getItem("rootify--bisectionData")!)
    if (bisectionData) {
      setData(bisectionData)
    }
    const showAnswer2 = JSON.parse(localStorage.getItem("rootify--showBisectionAnswer")!)
    setShowAnswer(showAnswer2);
  }, [])

  console.log("Data: ", data)

  if (showAnswer === true) {
    calcBisection(
      parseFloat(data.a),
      parseFloat(data.b),
      data.funcType,
      data.customFunc,
      data.iterations,
      parseFloat(data.error)
    )
  }

  function resetDataErrorToBlank() {
    setDataError({
      a: "",
      b: "",
      customFunc: "",
      iterations: "",
      error: ""
    });
  }

  const toggleShowAnswer = () => {
    resetDataErrorToBlank();

    setShowAnswer((prev) => {
      let newState = prev;
      // going to show the answer
      if (!prev) {
        if (verifyInputs(data) === false) {
          return newState;
        } else {
          newState = !newState;
          return newState;
        }
      }

      // going to remodify the values
      newState = !newState;

      localStorage.setItem("rootify--showBisectionAnswer", newState+"");
      return newState;
    })

    console.log("clicked solve!: "+showAnswer)
  };

  const verifyInputs = (data: bisectionData) => {
    const regexLetters = /[^0-9+\-,.\s]/;

    let success = true;
    if (regexLetters.test(data.a) || data.a.length === 0) {
      setDataError((prev) => ({...prev, a: "Invalid Number"}))
      success = false;
    }
    
    if (regexLetters.test(data.b) || data.b.length === 0) {
      setDataError((prev) => ({...prev, b: "Invalid Number"}))
      success = false;
    }

    if ((data.a === data.b)) {
      setDataError((prev) => ({
        ...prev, b: "Needs to be different from a",
        a: "Needs to be different from b"
      }))
      success = false;
    }

    // if ((data.b < data.a) || (data.a > data.b)) {
    //   setDataError((prev) => ({
    //     ...prev, b: "Needs to be greater than a"
    //   }))
    //   success = false;
    // }

    if (
      regexLetters.test(data.error) || 
      data.error.length === 0 || 
      data.error === "0." || 
      data.error === "0"
    ) {
      setDataError((prev) => ({...prev, error: "Invalid Number"}))
      success = false;
    }
    
    if (data.iterations <= 0 || data.iterations > 100) {
      setDataError((prev) => ({...prev, iterations: "Needs to be greater than zero or less than 100"}))
      success = false;
    }

    if (data.funcType === functionTypeEnums.AnyFunction && testFunc(data.customFunc) === false) {
      setDataError((prev) => ({...prev, customFunc: 'Invalid function'}))
      success = false;
    }

    return success;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => {
      const nextState = {
        ...prev,
        [event.target.name]: event.target.value
      }
      localStorage.setItem("rootify--bisectionData", JSON.stringify(nextState));
      resetDataErrorToBlank();
      verifyInputs(nextState);
      return nextState
    })
  }

  console.table(data)

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: { xs: 2, md: 4}, width: { xs: `calc(100% - ${drawerWidth}px)` } }}
    >
      <Toolbar />
      <Collapse in={!showAnswer}>
        <Stack spacing={2}>
          <Item variant="outlined">
            <Typography variant="h6" color="InfoText">Enter the interval</Typography>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: inputWidth },
              }}
              autoComplete="off"
            >
              <TextField
                error={dataError.a !== "" && true}
                helperText={dataError.a !== "" && dataError.a}
                required
                name="a"
                id="input--a"
                label="Value of a"
                value={data.a}
                variant="standard"
                onChange={handleChange} 
              />
              <TextField
                required
                error={dataError.b !== "" && true}
                helperText={dataError.b !== "" && dataError.b}
                name="b"
                id="input--b"
                label="Value of b"
                value={data.b}
                variant="standard"
                onChange={handleChange} 
              />
            </Box>          
          </Item>
          <Item variant="outlined">
            <Typography variant="h6" color="InfoText">Choose a function</Typography>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: inputWidth },
              }}
              autoComplete="off"
            >
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
                />
                <FormControlLabel 
                  name="funcType"
                  value={functionTypeEnums.AnyFunction} 
                  control={<Radio/>}
                  label="Custom" 
                />
                <Collapse 
                  in={data.funcType === functionTypeEnums.AnyFunction} 
                  orientation="horizontal"
                >
                  {data.funcType === functionTypeEnums.AnyFunction && <TextField
                    error={dataError.customFunc !== "" && true}
                    helperText={dataError.customFunc !== "" && dataError.customFunc}
                    name="customFunc"
                    id="input--func"
                    label="Format: f(x) = <Function>"
                    value={data.customFunc}
                    variant="standard"
                    onChange={handleChange} 
                  />}
                </Collapse>
              </RadioGroup>
            </Box>         
          </Item>
          <Item variant="outlined">
            <Typography variant="h6" color="InfoText">Enter the error</Typography>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1,width: inputWidth },
              }}
              autoComplete="off"
            >
              <TextField
                required
                error={dataError.error !== "" && true}
                helperText={dataError.error !== "" && dataError.error}
                name="error"
                id="input--error"
                label="Value of the error"
                value={data.error}
                variant="standard"
                onChange={handleChange} 
              />
            </Box>         
          </Item>
          <Item variant="outlined">
            <Typography variant="h6" color="InfoText">Enter the maximum number of iterations</Typography>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: inputWidth },
              }}
              autoComplete="off"
            >
              <TextField
                required
                error={dataError.iterations !== "" && true}
                helperText={dataError.iterations !== "" && dataError.iterations}
                name="iterations"
                id="input--iterations"
                label="Max value of iterations"
                type="number"
                value={data.iterations}
                variant="standard"
                onChange={handleChange} 
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </Box>         
          </Item>
        </Stack>
        <SolveBtn handleClick={toggleShowAnswer} />
      </Collapse>

      <Collapse in={showAnswer} orientation="vertical">
        {showAnswer === true &&<Paper
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            mb: 2,
          }}
          component="ul"
        >
          <ListItem>
            <Chip
              avatar={<Avatar>a</Avatar>}
              label={data.a} 
            />
          </ListItem>
          <ListItem>
            <Chip
              avatar={<Avatar>b</Avatar>}
              label={data.b} 
            />
          </ListItem>
          <ListItem>
            <Chip
              label={`${data.funcType === functionTypeEnums.LogFunction ? "f(x) = ln(x+1)" : formatFunc(data.customFunc, 'x')}`} 
            />
          </ListItem>
          <ListItem>
            <Chip
              label={`Max ${data.iterations} iteration${data.iterations > 1 && "s"}`} 
            />
          </ListItem>
          <ListItem>
            <Chip
              avatar={<Avatar>E</Avatar>}
              label={`${data.error}`} 
            />
          </ListItem>
        </Paper>}
        {showAnswer === true && <ResultTable 
          rows={calcBisection(
            parseFloat(data.a),
            parseFloat(data.b),
            data.funcType,
            data.customFunc,
            data.iterations,
            parseFloat(data.error)
          )} 
          funcType={data.funcType}
          customFunc={data.customFunc}
          methodType={methodTypeEnums.Bisection} />}
        <RedoBtn handleClick={toggleShowAnswer} />
      </Collapse>
    </Box>
  )
}