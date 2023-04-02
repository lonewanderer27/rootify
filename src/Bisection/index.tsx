import React, { useEffect, useState } from "react";
import { bisectionData, bisectionDataError } from "../types";
import calcBisection, { testBisectionInterval } from "../calculators/bisection";
import { defaultScreenCSS, drawerWidth, inputWidth } from "../App";
import { formatFunc, testFunc } from "../calculators/misc";
import { functionTypeEnums, methodTypeEnums } from "../enums";
import { hasInvalidCharacters, invalidError } from "../Checkers";

import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip"
import Collapse from '@mui/material/Collapse';
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from '@mui/material/Paper';
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import RedoBtn from "../Buttons/RedoBtn";
import ResultTable from "../ResultTable";
import Snackbar from "@mui/material/Snackbar";
import SolveBtn from "../Buttons/SolveBtn";
import Stack from "@mui/material/Stack"
import Switch from '@mui/material/Switch';
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
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
    standardMethod: true,
    customFunc: "",
    iterations: 0,
    error: ""
  }));
  const [dataError, setDataError] = useState<bisectionDataError>(() => ({
    a: "",
    b: "",
    func: [],
    iterations: "",
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
    const bisectionData = JSON.parse(localStorage.getItem("rootify--bisectionData")!)
    if (bisectionData) {
      setData(bisectionData)
    }
    const showAnswer2 = JSON.parse(localStorage.getItem("rootify--showBisectionAnswer")!)
    setShowAnswer(showAnswer2);
  }, [])

  console.log("Data:")
  console.table(data)

  if (showAnswer === true) {
    calcBisection(
      parseFloat(data.a),
      parseFloat(data.b),
      data.funcType,
      data.customFunc,
      data.iterations,
      parseFloat(data.error),
      data.standardMethod
    )
  }

  function resetDataErrorToBlank() {
    setDataError({
      a: "",
      b: "",
      func: [],
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

    console.log("clicked solve!: "+showAnswer)
  };

  const verifyInputs = (data: bisectionData) => {
    // Initializing the success variable to true
    let success = true;

    // Checking if interval a contains invalid characters or is empty
    if (hasInvalidCharacters(data.a) === true) {
      setDataError((prev) => ({...prev, a: "Invalid Number"}))
      success = false;
    }
    
    // Checking if interval b contains invalid characters or is empty
    if (hasInvalidCharacters(data.b) === true) {
      setDataError((prev) => ({...prev, b: "Invalid Number"}))
      success = false;
    }

    // Checking if interval a and b have the same value
    if ((data.a === data.b)) {
      setDataError((prev) => ({
        ...prev, b: "Needs to be different from a",
        a: "Needs to be different from b"
      }))
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
      setDataError((prev) => ({...prev, func: ['Invalid function']}))
      success = false;
    } else {
      const res = testBisectionInterval(parseFloat(data.a), parseFloat(data.b), data.funcType, data.customFunc)

      // Otherwise, check if the function is applicable to the values of f(a) and f(b)
      if (res.success === false) {
        // If the function is not applicable, set the error message and set success to false
        setDataError((prev) => (
         {
          ...prev,
          func: res.errorMessages
         }
        ))
        success = false;
      }
    }
    
    // Return the result of the verification
    return success;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, checked} = event.target
    setData((prev) => {
      const nextState = {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }
      localStorage.setItem("rootify--bisectionData", JSON.stringify(nextState));
      resetDataErrorToBlank();
      verifyInputs(nextState);
      return nextState
    })
  }

  const getResultTable = () => {
    const result = calcBisection(
      parseFloat(data.a),
      parseFloat(data.b),
      data.funcType,
      data.customFunc,
      data.iterations,
      parseFloat(data.error),
      data.standardMethod)
    
    return (
      <ResultTable 
        rows={result.rows}
        funcType={data.funcType}
        customFunc={data.customFunc}
        methodType={methodTypeEnums.Bisection}
        cn={result.cn}
        f_cn={result.f_cn}
      />
    )
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
            <Typography variant="h6" color="InfoText">Enter the interval</Typography>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: { xs: 0, sm: 1 }, width: inputWidth },
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
                      name="customFunc"
                      id="input--func"
                      label="Format: f(x) = <Function>"
                      value={data.customFunc}
                      variant="standard"
                      onChange={handleChange} 
                    />}
                  </Collapse>
                </RadioGroup>
                {dataError.func.length !== 0 && dataError.func.map((error) => {
                  return (
                    <Typography variant="caption" display="block" sx={{ color: "red" }} gutterBottom>
                      {error}
                    </Typography>
                  )
                })}
              </>
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
          <Item variant="outlined">
            <Typography variant="h6" color="InfoText">Choose the algorithm that will be used</Typography>
            <Typography variant="caption">Do not change unless absolutely necessary</Typography><br/>
            <Typography variant="caption">Default is Standard Method</Typography>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: { xs: 0, sm: 1 }, width: '100%' },
              }}
              autoComplete="off"
            >
              <FormControlLabel
                control={<Switch checked={data.standardMethod} onChange={handleChange} name="standardMethod" />}
                label={data.standardMethod ? "Standard Method" : "Old Method" }
              />
              <Typography color="InfoText" sx={{fontWeight: "bold"}}>Standard Method: </Typography>
              <Typography gutterBottom>
                {`If f(a) * f(c) < 0, then new interval is [a, c]`}<br/>
                {`If f(a) * f(c) > 0, then new interval is [c, b]`}
              </Typography>
              <Typography color="InfoText" sx={{fontWeight: "bold"}}>Old Method: </Typography>
              <Typography gutterBottom>
                {`If f(c) is positive, then new interval is [a, c]`}<br/>
                {`If f(c) is negative, then new interval is [c, b]`}
              </Typography>
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
        {showAnswer === true && getResultTable()}
        <RedoBtn handleClick={toggleShowAnswer} />
      </Collapse>
      <Snackbar
        open={dataErrorNoticeOpen}
        autoHideDuration={6000}
        onClose={handleDataErrorNoticeClose}
      >
        <Alert severity="error" onClose={handleDataErrorNoticeClose}>Please fix the errors first then try again.</Alert>
      </Snackbar>
    </Box>
  )
}