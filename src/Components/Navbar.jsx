import { AppBar,Toolbar,Typography, IconButton} from "@mui/material";
import { GitHub } from "@mui/icons-material";

const NavBar = ({connected}) => {
  // hide navbar on mobile devices
 
  return (
    <AppBar position="fixed"  sx={{ background: "transparent", boxShadow: "none" }}>
      <Toolbar>
         <Typography variant="h4" component="div" sx={{ flexGrow: 1, color: 'white'}}>VooCall </Typography> 
         <IconButton href="https://github.com/Kdaksh/voo-call" target="_blank" sx={{ color: 'white'}}><GitHub/></IconButton>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;