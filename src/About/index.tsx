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
        Made by MarkTheBurst and lonewanderer27!<br></br>
        Yet to be filled X0X0
      </Typography>
    </Box>
  )
}