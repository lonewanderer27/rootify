import { defaultScreenCSS, drawerWidth } from "../App";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useState } from "react";

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

export default function Secant() {
  const [showAnswer, setShowAnswer] = useState(() => false);
  const [displayOneAnswer, setDisplayOneAnswer] = useState(() => false);
  const toggleOneAnswer = () => setDisplayOneAnswer((prev) => !prev);
  
  // const toggleShowAnswer = () => {
  //   resetDataErrorToBlank();

  //   setShowAnswer((prev) => {
  //     let newState = prev;
  //     // going to show the answer
  //     if (!prev) {
  //       if (verifyInputs(data) === false) {
  //         setDataErrorNoticeOpen(() => true)
  //         return newState;
  //       } else {
  //         newState = !newState;
  //         return newState;
  //       }
  //     }

  //     // going to remodify the values
  //     newState = !newState;
  //     return newState;
  //   })
    
  //   console.log("clicked solve!")
  // };

  const verifyInputs = (data: any) => {
    // Initializing the success variable to true
    let success = true;

    return success;
  }
  
  return (
     <Box
      component="main"
      sx={{ flexGrow: 1, width: { xs: `calc(100% - ${drawerWidth}px)` }, ...defaultScreenCSS }}
    >
      <Stack spacing={2}>
        <Item variant="outlined">
          
        </Item>
      </Stack>
      {/* <Collapse in={!showAnswer}></Collapse> */}
    </Box>
  )
}