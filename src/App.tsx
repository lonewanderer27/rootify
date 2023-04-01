import About from './About';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AppBar from '@mui/material/AppBar';
import Bisection from './Bisection';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
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
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { methodTypeEnums } from './enums';
import { useState } from 'react';

export const drawerWidth = 240;
export const inputWidth = '45vw';

export const defaultScreenCSS = {
  p: { xs: 2, sm: 5, md: 10, lg: 20}
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [methodType, setMethodType] = useState<methodTypeEnums | null>(() => methodTypeEnums.Bisection);

  const switchToBisection = () => setMethodType(() => methodTypeEnums.Bisection);
  const switchToNewton = () => setMethodType(() => methodTypeEnums.Newton);
  const switchToAbout = () => setMethodType(() => null);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {[methodTypeEnums.Bisection, methodTypeEnums.Newton].map((text, index) => (
          <ListItem 
            key={text} 
            onClick={text === methodTypeEnums.Bisection ? switchToBisection : switchToNewton}
          >
            <ListItemButton>
              <ListItemIcon>
                {index === 0 ? <ForkRightIcon /> : <AcUnitIcon/>}
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
          <Typography variant="h6" noWrap component="div" sx={{marginRight: "auto"}}>
            {methodType === methodTypeEnums.Bisection && "Bisection"}
            {methodType === methodTypeEnums.Newton && "Newton"} 
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
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {methodType === methodTypeEnums.Bisection && <Bisection />}
      {methodType === methodTypeEnums.Newton && <Newton />}
      {methodType === null && <About/>}
    </Box>
  );
}

export default App
