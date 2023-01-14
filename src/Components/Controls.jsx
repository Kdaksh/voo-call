import { ButtonGroup, IconButton } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import Mic from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { useState, useContext } from "react";
import SnackbarContent from "@mui/material";
import { firestore } from "../firebase-config";
import { PieChart } from "@mui/icons-material";
const Controls = ({ localRef, handleEndCall,pc}) => {
  //const {handleAlert} = useContext(SnackbarContext);
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  let LocalStream = localRef.current.srcObject;

  const handleCamera = () => {
    setCamera(!camera);
    if (camera) {
      LocalStream.getVideoTracks()[0].enabled = false;
    } else {
      LocalStream.getVideoTracks()[0].enabled = true;
    }
  };
  const handleMic = () => {
    setMic(!mic);
    if (mic) {
      LocalStream.getAudioTracks()[0].enabled = false;
    } else {
      LocalStream.getAudioTracks()[0].enabled = false;
    }
  };
  






  return (
    <>
      <div className="controls">
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          size="large"
          sx={{
            backgroundColor: "#d32f2f",
            paddingLeft: "10px",
            paddingRight: "10px",
            display: "flex",
          }}
        >
          <IconButton onClick={handleCamera} active>
            {camera ? (
              <VideocamIcon
                color="secondary"
                sx={{ fill: "white" }}
                fontSize="large"
              />
            ) : (
              <VideocamOffIcon
                color="secondary"
                sx={{ fill: "white" }}
                fontSize="large"
              />
            )}
          </IconButton>
          <IconButton
            sx={{ marginLeft: "20px", marginRight: "20px" }}
            onClick={handleEndCall}
          >
            <CallEndIcon
              color="secondary"
              sx={{ fill: "white" }}
              fontSize="large"
            />
          </IconButton>
          <IconButton onClick={handleMic}>
            {mic ? (
              <Mic color="secondary" sx={{ fill: "white" }} fontSize="large" />
            ) : (
              <MicOffIcon
                color="secondary"
                sx={{ fill: "white" }}
                fontSize="large"
              />
            )}
          </IconButton>
        </ButtonGroup>
      </div>
    </>
  );
};
export default Controls;
