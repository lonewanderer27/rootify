import React, { useEffect, useState } from "react";
import { bisectionData, bisectionDataError, newtonData, newtonDataError } from "../types";
import { drawerWidth, inputWidth } from "../App";
import { formatFunc, testFunc } from "../calculators/misc";
import { functionTypeEnums, methodTypeEnums } from "../enums";

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip"
import Collapse from '@mui/material/Collapse';
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid";
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
import calcNewton from "../calculators/newton";
import { defaultScreenCSS } from "../App";
import { derivative } from "mathjs";
import { randomTableVal } from "../calculators/test";
import { styled } from '@mui/material/styles';

export function get1stDerivative(stringCustomFunc: string, stringVar: string){
  return derivative(stringCustomFunc, stringVar)
}

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

export default function Newton() {
  const [showAnswer, setShowAnswer] = useState(() => false);
  const [data, setData] = useState<newtonData>(() => ({
    xn: "",
    iterations: 0,
    funcType: functionTypeEnums.LogFunction,
    customFunc: "",
    error: ""
  }));
  const [dataError, setDataError] = useState<newtonDataError>(() => ({
    xn: "",
    iterations: "",
    customFunc: "",
    error: ""
  }));

  useEffect(() => {
    const newtonData = JSON.parse(localStorage.getItem("rootify--newtonData")!)
    if (newtonData) {
      setData(newtonData);
    }
    const showAnswer2 = JSON.parse(localStorage.getItem("rootify--showNewtonAnswer")!)
    setShowAnswer(showAnswer2);
  }, [])

  function resetDataErrorToBlank() {
    setDataError({
      xn: "",
      iterations: "",
      customFunc: "",
      error: ""
    })
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

      localStorage.setItem("rootify--showNewtonAnswer", newState+"");
      return newState;
    })
    
    console.log("clicked solve!")
  };

  const verifyInputs = (data: newtonData) => {
    const regexLetters = /[^0-9+\-,.\s]/;

    let success = true;
    if (regexLetters.test(data.xn) || data.xn.length === 0) {
      setDataError((prev) => ({...prev, xn: "Invalid Number"}))
      success = false;
    }

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
      localStorage.setItem("rootify--newtonData", JSON.stringify(nextState));
      resetDataErrorToBlank();
      verifyInputs(nextState);
      return nextState
    })
  }

  console.table(data)

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, width: { xs: `calc(100% - ${drawerWidth}px)` }, ...defaultScreenCSS }}
    >
      <Toolbar />
      <Collapse in={!showAnswer}>
        <Stack spacing={2}>
          <Item variant="outlined">
            <Typography variant="h6" color="InfoText">Enter the Xn</Typography>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: inputWidth },
              }}
              autoComplete="off"
            >
              <TextField
                error={dataError.xn !== "" && true}
                helperText={dataError.xn !== "" && dataError.xn}
                required
                name="xn"
                id="input--xn"
                label="Value of Xn"
                value={data.xn}
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
                <Collapse in={data.funcType === functionTypeEnums.AnyFunction}  orientation="horizontal">
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
                '& > :not(style)': { m: 1, width: inputWidth },
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
            <Typography variant="h6" color="InfoText">Enter the number of iterations</Typography>
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
                label="Value of iterations"
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
        {showAnswer === true && <Paper
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
              avatar={<Avatar>Xn</Avatar>}
              label={data.xn} 
            />
          </ListItem>
          <ListItem>
            <Chip
              label={`${data.funcType === functionTypeEnums.LogFunction ? "f(Xn) = ln(x+1)" : formatFunc(data.customFunc, 'Xn')}`} 
            />
          </ListItem>
          <ListItem>
            <Chip
              label={`${data.funcType === functionTypeEnums.LogFunction ? "f'(Xn) = 1/(x+1)" : "f'(Xn) = "+get1stDerivative(data.customFunc,'x').toString()}`} 
            />
          </ListItem>
          <ListItem>
            <Chip
              label={`${data.iterations} iteration${data.iterations > 1 ? "s" : ""}`} 
            />
          </ListItem>
          <ListItem>
            <Chip
              avatar={<Avatar>E</Avatar>}
              label={data.error} 
            />
          </ListItem>
        </Paper>}
        {showAnswer === true && <ResultTable 
          rows={calcNewton(
            parseFloat(data.xn),
            data.funcType,
            data.customFunc,
            data.iterations,
            parseFloat(data.error)
          )} 
          funcType={data.funcType}
          customFunc={formatFunc(data.customFunc, 'Xn')}
          firstDerivativeFunc={get1stDerivative(data.customFunc,'x')}
          methodType={methodTypeEnums.Newton} 
        />}
        <RedoBtn handleClick={toggleShowAnswer} />
      </Collapse>
    </Box>
  )
}