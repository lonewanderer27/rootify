import React, { useEffect, useState } from "react";
import { drawerWidth, inputWidth } from "../App";
import { formatFunc, testFunc } from "../calculators/misc";
import { functionTypeEnums, methodTypeEnums } from "../enums";
import { hasInvalidCharacters, invalidError } from "../Checkers";
import { newtonData, newtonDataError } from "../types";

import Alert from "@mui/material/Alert";
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
import Snackbar from "@mui/material/Snackbar";
import SolveBtn from "../Buttons/SolveBtn";
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import calcNewton from "../calculators/newton";
import { defaultScreenCSS } from "../App";
import { derivative } from "mathjs";
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
  const [dataErrorNoticeOpen, setDataErrorNoticeOpen] = useState(() => false);

  const handleDataErrorNoticeClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setDataErrorNoticeOpen(() => false)
  }

  useEffect(() => {
    const newtonData = JSON.parse(localStorage.getItem("rootify--newtonData")!)
    if (newtonData) {
      setData(newtonData);
    }
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
          setDataErrorNoticeOpen(() => true)
          return newState;
        } else {
          newState = !newState;
          return newState;
        }
      }

      // going to remodify the values
      newState = !newState;
      return newState;
    })
    
    console.log("clicked solve!")
  };

  const verifyInputs = (data: newtonData) => {
    // Initializing the success variable to true
    let success = true;
    
    // Checking if Xn contains invalid characters or is empty
    if (hasInvalidCharacters(data.xn)) {
      setDataError((prev) => ({...prev, xn: "Invalid Number"}))
      success = false;
    }

    // Checking if error contains invalid characters, is empty or is equal to '0.' or '0'
    if (invalidError(data.error) === true) {
      // If error is invalid, set the error message and set success to false
      setDataError((prev) => ({...prev, error: "Invalid Number"}))
      success = false;
    }
    
    // Checking if 'iterations' is less than or equal to zero or greater than 100
    if (data.iterations <= 0 || data.iterations > 100) {
      // If 'iterations' is invalid, set the error message and set success to false
      setDataError((prev) => ({...prev, iterations: "Needs to be greater than zero or less than 100"}))
      success = false;
    }

    // Checking if the function type is 'AnyFunction' and the custom function is invalid
    if (data.funcType === functionTypeEnums.AnyFunction && testFunc(data.customFunc) === false) {
      // If the function is invalid, set the error message and set success to false
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

  const getResultTable = () => {
    const result = calcNewton(
      parseFloat(data.xn),
      data.funcType,
      data.customFunc,
      data.iterations,
      parseFloat(data.error))
    
    return (
      <ResultTable 
        rows={result.rows}
        cn={result.cn}
        f_cn={result.f_cn}
        funcType={data.funcType}
        customFunc={formatFunc(data.customFunc, 'Xn')}
        firstDerivativeFunc={get1stDerivative(data.customFunc,'x')}
        methodType={methodTypeEnums.Newton} 
      />
    )
  }

  console.log("Data")
  console.table(data)
  if (showAnswer === true) {
    calcNewton(
      parseFloat(data.xn),
      data.funcType,
      data.customFunc,
      data.iterations,
      parseFloat(data.error),
    )
  }


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
                '& > :not(style)': { m: { xs: 0, sm: 1 }, width: inputWidth },
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
                '& > :not(style)': { m: { xs: 0, sm: 1 }, width: inputWidth },
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
                '& > :not(style)': { m: { xs: 0, sm: 1 }, width: inputWidth },
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
                '& > :not(style)': { m: { xs: 0, sm: 1 }, width: inputWidth },
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
        {showAnswer === true && getResultTable()}
        <RedoBtn handleClick={toggleShowAnswer} />
      </Collapse>
      <Snackbar
        open={dataErrorNoticeOpen}
        autoHideDuration={6000}
        onClose={handleDataErrorNoticeClose}
      >
        <Alert severity="error" onClose={handleDataErrorNoticeClose}>
          Please fix the errors first then try again.
        </Alert>
      </Snackbar>
    </Box>
  )
}