import {Box,Tabs,Tab,Button,TextField} from "@mui/material";
import { useState } from "react";
import { useContext } from "react";
import { TabPanelFormProps } from "../LandingComponent";
const TabPanelForm = () => {
    const {joinRoom,createRoom,inputDisabled,setInputValue,inputValue} = useContext(TabPanelFormProps);
    
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
  return (
    <>
      <main>
        <div className="main-header">{" "}<h1 className="text-center">One-To-One Video Calls</h1> </div>
        <div className="main-container">
          <div className="main-container-tabs">
            <Box>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" indicatorColor="secondary"  textColor="inherit">
                <Tab label="Create" sx={{ fontSize: "1.25rem" }} />
                <Tab label="Join" sx={{ fontSize: "1.25rem" }} />
              </Tabs>
            </Box>
          </div>
          <div className="main-container-tab-panel">
            <div role="tabpanel"  hidden={value !== 0} id="simple-tabpanel-0" aria-labelledby="simple-tab-0/" className="main-panels" >
              {value === 0 && (
                <Box sx={{ p: 3 }} className="create-panel">
                  <Button variant="contained" color="secondary" size="large" onClick={createRoom}>Create Room</Button>
                </Box>
              )}
            </div>
            <div role="tabpanel" hidden={value !== 1} className="main-panels" id="simple-tabpanel-1" aria-labelledby="simple-tab-1" >
              {value === 1 && (
                <Box sx={{ p: 3 }}>
                  <TextField id="outlined-basic"  label="Room ID"  size="large" disabled={inputDisabled} onChange={(e) => setInputValue(e.target.value)} sx={{ marginBottom: "10px" }} color="secondary" variant="outlined" fullWidth/>
                  <Button variant="contained" color="secondary" size="large" onClick={() => {joinRoom(inputValue)}} fullWidth > Join Room</Button>
                </Box>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default TabPanelForm;

