import { Box, Toolbar, Typography } from "@mui/material";

import DeveloperCard from "../DeveloperCard";
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import Grid from '@mui/material/Grid';
import LinkIcon from '@mui/icons-material/Link';
import { LinkedIn } from "@mui/icons-material";
import { defaultScreenCSS } from "../App";
import { drawerWidth } from "../App";
import jayImg from "../assets/jay.jpg"
import markyImg from "../assets/marky.jpg"

export default function About(){
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, ...defaultScreenCSS }}
    > 
      <Toolbar/>
      <Typography paragraph>
      Rootify is a numerical methods tool built using React. It allows users to calculate the roots of a function using two different methods: the bisection method and the Newton-Raphson method.
      </Typography>

      <Typography paragraph>
      Users can enter a mathematical function, specify the method they want to use, and set parameters such as the initial interval and the maximum number of iterations. This website will then generate a table showing the calculated values for each iteration of the selected method, as well as whether or not the error is less than a specified tolerance.
      </Typography>

      <Typography paragraph>
      The user can then analyze the table to determine the root of the function to the desired degree of accuracy. Rootify uses the MathJS library to parse and evaluate the user's mathematical function.
      </Typography>


      <Box sx={{ my: 5 }}>
        <Typography variant="h5" gutterBottom>
          Who developed this awesome app?
        </Typography>
        <div style={{display: "flex"}}>
          <DeveloperCard
            name="Mark Bonifacio"
            caption="Software Engineer"
            description="A computer science major who is experienced in frontend web development and UI design. I aim to utilize my knowledge to help others and gain more experiences. "
            image={markyImg}
            socials={[
              {
                icon: <FacebookIcon fontSize="medium"/>, 
                url: "https://www.facebook.com/MarkyJamesBonifacio",
                websiteName: "Facebook"
              },
              {
                icon: <GitHubIcon fontSize="medium"/>, 
                url: "https://github.com/SwiftNCloak",
                websiteName: "Github"
              },
              {
                icon: <LinkedIn fontSize="medium"/>, 
                url: "https://www.linkedin.com/in/markjamescbonifacio/",
                websiteName: "LinkedIn"
              },
            ]}      
          />
          <DeveloperCard
            name="Adriane James"
            caption="Full Stack Web Dev"
            description="Passionate about creating highly interactive web applications with responsive design on every device. A team player but can also work independently. Values efficiency and timeliness in assigned tasks."
            image={jayImg}
            socials={[
              {
                icon: <GitHubIcon/>,
                url: "https://github.com/lonewanderer27",
                websiteName: "Github"
              },
              {
                icon: <LinkIcon />, 
                url: "https://jay.thedev.id",
                websiteName: "Personal Website"
              },
              {
                icon: <LinkedIn fontSize="medium"/>, 
                url: "https://www.linkedin.com/in/jay-puzon/",
                websiteName: "LinkedIn"
              },
            ]}      
          />
        </div>
      </Box>
    </Box>
  )
}