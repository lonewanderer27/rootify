import { Box, Toolbar, Typography } from "@mui/material";

import { drawerWidth } from "../App";

export default function About(){
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
    > 
      <Toolbar/>
      <Typography paragraph>
      Rootify is a numerical methods tool built using React. It allows users to calculate the roots of a function using two different methods: the bisection method and the Newton-Raphson method.
      </Typography>

      <Typography paragraph>
      Users can enter a mathematical function, specify the method they want to use, and set parameters such as the initial interval and the maximum number of iterations. The website will then generate a table showing the calculated values for each iteration of the selected method, as well as whether or not the error is less than a specified tolerance.
      </Typography>

      <Typography paragraph>
      The user can then analyze the table to determine the root of the function to the desired degree of accuracy. The website uses the MathJS library to parse and evaluate the user's mathematical function.
      </Typography>

      <Typography variant="h5">
        Who developed this awesome app?
      </Typography>
    </Box>
  )
}