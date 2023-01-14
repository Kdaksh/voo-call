import React from "react";
import {
  CircularProgress,
  Box,
  IconButton,
  Button,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  FormControl,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { circularProgressClasses } from "@mui/material";
import { useEffect } from "react";

const WaitingRoom = ({ roomID, handleAlert, pc,handleEndCall }) => {
  const copyCode = () => {
    try {
      navigator.clipboard.writeText(roomID);
      handleAlert("Copied to clipboard");
    } catch (error) {
      handleAlert("Failed to copy");
    }
  };
  const shareCode = () => {
    try {
      navigator.share({
        url: `${window.location.origin}/join?joinRoom=${roomID}`,
        text: "Join my Call on VooCall",
        title: "VooCall",
      });
    } catch (error) {
      handleAlert("Failed to share");
    }
  };
  // create a remote channel to get hangup updates
  




  return (
    <>
      <div className="loader-waiter">
        <FormControl sx={{ m: 1, margin: "auto",display:'flex' }} color="secondary">
          <InputLabel htmlFor="outlined-adornment-amount">Call ID</InputLabel>

          <OutlinedInput
            fullWidth
            label="Call ID"
            
            
            value={roomID}
            sx={{marginBottom:'10px'}}
            endAdornment={
              <>
                <InputAdornment position="end" sx={{ color: "white" }}>
                  <IconButton onClick={shareCode}>
                    <ShareIcon color="secondary" />
                  </IconButton>
                </InputAdornment>
                <InputAdornment position="end">
                  <IconButton onClick={copyCode}>
                    <ContentCopyIcon color="secondary" />
                  </IconButton>
                </InputAdornment>
              </>
            }
          />
          <Button variant="contained" color="error" onClick={handleEndCall}>Exit Call</Button>
        </FormControl>
      </div>
    </>
  );
};

export default WaitingRoom;
