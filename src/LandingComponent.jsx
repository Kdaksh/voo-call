import { useState, useEffect } from "react";
import { v4, validate } from "uuid";
import { firestore } from "./firebase-config";
import MainApp from "./MainApp";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { createContext } from "react";
import { Snackbar } from "@mui/material";
import NavBar from "./Components/Navbar";
import TabPanelForm from "./Components/TabPanelForm";
const TabPanelFormProps = createContext();
const SnackbarContext = createContext();
const LandingComponent = () => {
   

  const [inputValue, setInputValue] = useState("");
  const [call, setCall] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [roomID, setRoomID] = useState(null);
  const [mode, setMode] = useState(null);
  const [snackPack, setSnackPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);
  

  

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
        // Set a new snack when we don't have an active one
        setMessageInfo({ ...snackPack[0] });
        setSnackPack((prev) => prev.slice(1));
        setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
        // Close an active snack when a new one is added
        setOpen(false);
    }

}, [snackPack, messageInfo, open]);

useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)

    if (searchParams.has("joinRoom")) {
        joinRoom(searchParams.get("joinRoom"));
    }

},[]);





const handleClose = (event, reason) => {
    if (reason === "clickaway") {
        return;
    }
    setOpen(false);
};
const handleAlert = (message)=>{
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
}
const handleExited = () => {
    setMessageInfo(undefined);
};
const vertical = "top";
const horizontal = "center";
  
  const createRoom = () => {
    const id = v4();

    setRoomID(id);
    setMode("create");
    setCall(true);
  };
  const joinRoom = (id) => {
    setInputDisabled(true);
   // handleToggle();

    if (validate(id)) {
      const callDoc = firestore.collection("calls").doc(id);
      callDoc.get().then((doc) => {
        if (doc.exists && !doc.data().answer) {
          setRoomID(id);
          setMode("join");
            
          setCall(true);
        } else {
          handleAlert("No such Call or Call is already in progress");

          setInputDisabled(false);
        }
      });
    } else {
      handleAlert("Invalid Room ID");
      setInputDisabled(false);
    }
   
    setInputDisabled(false);
  };

  return (
    <>
      {call ? <SnackbarContext.Provider value={{handleAlert}}><MainApp mode={mode} roomID={roomID} setCall={setCall} /></SnackbarContext.Provider> : <TabPanelFormProps.Provider value={{joinRoom,createRoom,setInputValue,inputValue,inputDisabled}}><NavBar/><TabPanelForm/></TabPanelFormProps.Provider>}
      <Snackbar key={messageInfo ? messageInfo.key : undefined}  anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={3000}   onClose={handleClose}  TransitionProps={{ onExited: handleExited }}  message={messageInfo ? messageInfo.message : undefined}      action={<>  <IconButton aria-label="close" color="inherit" sx={{ p: 0.5 }} onClick={handleClose}> <CloseIcon /></IconButton></>} />
    </>
  );
};
export default LandingComponent;
export {TabPanelFormProps,SnackbarContext};
