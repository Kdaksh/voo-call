import { AppBar,Toolbar,Typography } from "@mui/material";
const NavBar = ({connected}) => {
  // hide navbar on mobile devices
 
  return (
    <AppBar position="fixed"  sx={{ background: "transparent", boxShadow: "none" }}>
      <Toolbar>
         <Typography variant="h4" component="div" sx={{ flexGrow: 1, color: 'white'}}>VooCall </Typography> 

      </Toolbar>
    </AppBar>
  );
};
export default NavBar;