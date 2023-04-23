import { methodTypeEnums, tableMethodTypeEnums } from './enums';

import About from './About';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AppBar from '@mui/material/AppBar';
import Bisection from './Bisection';
import { BisectionTable } from './Bisection/table';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Newton from './Newton';
import Secant from './Secant';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export const drawerWidth = 240;
export const inputWidth = '45vw';

export const defaultScreenCSS = {
  p: { xs: 2, md: 10, lg: 20}
}

function App() {
  const queryParams = new URLSearchParams(window.location.search)
  const enableSecant = queryParams.get("secant") === "true" ? true : false

  const [enableTable, setEnableTable] = useState(() => false);
  const [mobileOpen, setMobileOpen] = useState(() => false);
  const [methodType, setMethodType] = useState<methodTypeEnums | null>(() => {
    if (enableSecant) {
      return methodTypeEnums.Secant
    } else {
      return methodTypeEnums.Bisection
    }
  });
  
  console.log("SECANT ENABLED: " + enableSecant)

  const toggleTable = () => setEnableTable((prev) => {
    return !prev;
  })
  const switchToBisection = () => setMethodType(() => {
    setMobileOpen(false)
    return methodTypeEnums.Bisection;
  });
  const switchToNewton = () => setMethodType(() => {
    setMobileOpen(false)
    return methodTypeEnums.Newton;
  });
  const switchToSecant = () => setMethodType(() => {
    setMobileOpen(false)
    return methodTypeEnums.Secant;
  });
  const switchToAbout = () => setMethodType(() => {
    setMobileOpen(false)
    return null;
  });

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const availableMethodTypes = () => {
    if (enableSecant) {
      return [methodTypeEnums.Bisection, methodTypeEnums.Newton, methodTypeEnums.Secant]
    } else {
      return [methodTypeEnums.Bisection, methodTypeEnums.Newton]      
    }
  }
  
  const availableTableMethodTypes = () => {
    if (enableSecant) {
      return [
        tableMethodTypeEnums.BisectionTable, 
        tableMethodTypeEnums.NewtonTable,
        tableMethodTypeEnums.SecantTable
      ]
    } else {
      return [
        tableMethodTypeEnums.BisectionTable, 
        tableMethodTypeEnums.NewtonTable
      ]   
    }
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {availableMethodTypes().map((text, index) => (
          <ListItem 
            key={text} 
            onClick={() => {
              setEnableTable(false)
              switch(index) {
                case 0: return switchToBisection();
                case 1: return switchToNewton();
                case 2: return switchToSecant();
              }
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                {index === 1 && <ForkRightIcon />}
                {index === 0 && <AcUnitIcon />}
                {enableSecant && index === 2 && <DeviceHubIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider/>
      <List>
        {availableTableMethodTypes().map((text, index) => (
          <ListItem
            key={text}
            onClick={() => {
              setEnableTable(true)
              switch(index) {
                case 0: return switchToBisection();
                case 1: return switchToNewton();
                case 2: return switchToSecant();
              }
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                {index === 1 && <ForkRightIcon />}
                {index === 0 && <AcUnitIcon />}
                {enableSecant && index === 2 && <DeviceHubIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider/>
      <List>
        <ListItem onClick={switchToAbout}>
          <ListItemButton>
            <ListItemIcon>
              <InfoIcon/>
            </ListItemIcon>
            <ListItemText primary="About"/>
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container = document.body;

  console.log(`Drawer is ${mobileOpen ? "open" : "closed"}`)
  console.log("Active method: " + methodType)
  console.log("Table enabled: " + enableTable)

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <img src="/logo.png" style={{width: "40px", height: "auto", marginRight: "20px"}} />
          <Typography variant="h6" noWrap component="div" sx={{marginRight: "auto"}}>
            {methodType === methodTypeEnums.Bisection && "Bisection"}
            {methodType === methodTypeEnums.Newton && "Newton"}
            {methodType === methodTypeEnums.Secant && "Secant"}
            {enableTable === true && " Table"}
            {methodType === null ? "About Rootify" : " Method"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open={mobileOpen}
          onClose={handleDrawerToggle}
        >
          {drawer}
        </Drawer>
      </Box>

      {methodType === methodTypeEnums.Bisection && enableTable === false &&
        <Bisection />}
      {methodType === methodTypeEnums.Bisection && enableTable === true &&
        <BisectionTable />}
      {methodType === methodTypeEnums.Newton && enableTable === false &&
        <Newton />}
      {/* {methodType === methodTypeEnums.Newton && enableTable === true &&
        <NewtonTable />} */}
      {methodType === methodTypeEnums.Secant && enableTable === false &&
        <Secant />}
      {methodType === null && 
        <About/>}
    </Box>
  );
}

export default App
