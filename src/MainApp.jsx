import { useEffect, useState, useRef } from "react";
import NavBar from "./Components/Navbar";
import { useContext } from "react";
import { SnackbarContext } from "./LandingComponent";
import { createRoom, joinRoom } from "./main";
import { CircularProgress } from "@mui/material";
import { firestore } from "./firebase-config";
import Controls from "./Components/Controls";
import WaitingRoom from "./Components/WaitingRoom";
const MainApp = ({ roomID, mode, setCall }) => {
  const { handleAlert } = useContext(SnackbarContext);
  const configuration = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);

  let localStream;
  let remoteStream;
  const localRef = useRef();
  const remoteRef = useRef();
  const [connected, setConnected] = useState(false);
  const [LocalStream, setLocalStream] = useState(null);
  const [RemoteStream, setRemoteStream] = useState(null);
  // useEffect(() => {
  //   console.log(LocalStream, RemoteStream);
  // }, [LocalStream, RemoteStream]);
  const handleCamera = () => {
    setCamera(!camera);
    let LocalStrea = localRef.current.srcObject;

    if (camera) {

      LocalStrea.getVideoTracks()[0].enabled = false;
      //console.log(LocalStrea);
     // setLocalStream(LocalStrea);
    } else {
      LocalStrea.getVideoTracks()[0].enabled = true;
     // setLocalStream(LocalStream);
    }
  };
  

  const [pc, setPc] = useState(new RTCPeerConnection(configuration));
  

  const init = async () => {
    try {
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      if (!navigator.getUserMedia) {
        handleAlert("Your Browser Does Not Support Video Calling");
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localRef.current.srcObject = stream;
        localStream = stream;
        setLocalStream(stream);
        remoteStream = new MediaStream();
        remoteRef.current.srcObject = remoteStream;
        setRemoteStream(remoteStream);

        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
        pc.ontrack = (event) => {
          console.log("on track");
          setConnected(true);
          event.streams[0].getTracks().forEach((track) => {
            //     console.log(track);

            remoteStream.addTrack(track);
          });
          // console.log(remoteStream);
          // setRemoteStream(remoteStream);
          //  console.log(RemoteStream);
        };
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  function registerPeerConnectionListeners() {
    pc.addEventListener("icegatheringstatechange", () => {
      console.log(`ICE gathering state changed: ${pc.iceGatheringState}`);
    });

    pc.addEventListener("connectionstatechange", () => {
      console.log(`Connection state change: ${pc.connectionState}`);
      if (pc.connectionState === "disconnected") {
        handleEndCall();
      }
    });

    pc.addEventListener("signalingstatechange", () => {
      console.log(`Signaling state change: ${pc.signalingState}`);
    });

    pc.addEventListener("iceconnectionstatechange ", () => {
      console.log(`ICE connection state change: ${pc.iceConnectionState}`);
    });
  }
  

  const setupSources = async (mode, id) => {
    console.log(id);
    await init();
    if (mode === "create") {
      await createRoom(id, registerPeerConnectionListeners, pc, remoteStream);
    } else {
      await joinRoom(id, registerPeerConnectionListeners, pc, remoteStream);
    }
  };
  useEffect(() => {
    setupSources(mode, roomID);
    // eslint-disable-next-line
  }, []);
  
  const handleMic = () => {
    setMic(!mic);
    let LocalStrea = remoteRef.current.srcObject;

    if (mic) {
    //  let LocalStrea = localRef.current.srcObject;
      LocalStrea.getAudioTracks()[0].enabled = false;
     // setLocalStream(LocalStrea);
    } else {
      LocalStrea.getAudioTracks()[0].enabled = false;
     // setLocalStream(LocalStream);
    }
  };
  const handleEndCall = async () => {
    console.log("end call");
    setCall(false)
   



    const tracks = localRef.current.srcObject.getTracks();
    const remoteTracks = remoteRef.current.srcObject.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });

    if (remoteStream) {
      remoteTracks.forEach((track) => track.stop());
    }
    setConnected(false);

   
    if (roomID) {
      const db = firestore;
      const roomRef = db.collection("calls").doc(roomID);
      const calleeCandidates = roomRef.collection("offerCandidates");
      calleeCandidates.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });
      const callerCandidates = roomRef.collection("answerCandidates");
      callerCandidates.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });
      // const callerCandidates = await roomRef.collection('answerCandidates').get();
      // callerCandidates.forEach(async candidate => {
      //   await
      // });
      await roomRef.delete();
      if (pc) {
        pc.close();
      }
     
      
    }

    console.log("Call ended");
    console.clear();
    handleAlert("Call Ended");
  };
  
  
  /*Main Logic Ends*/
  // check wether remote user's mic and camera is on or off
  const checkRemoteStream = () => {
    if (remoteStream) {
      if (remoteStream.getVideoTracks()[0].enabled) {
        console.log(true);
      }
    }
  };


  return (
    <>
      {window.innerWidth > 600 ? <NavBar connected={connected} /> : null}


      <div className="streams">

        <div className="stream">
          <video
            className="local-stream-video"
            ref={localRef}
            autoPlay
            muted
          />
        </div>
        <div className={!connected ? "empty-stream stream" : "stream"} >
          
           <video
          hidden={!connected}
            autoPlay
            playsInline
            ref={remoteRef}
            className="remote-stream-video"
            />
     
          
        </div>
        </div>
        {connected ? 
<Controls localRef={localRef} remoteRef={remoteRef} roomID={roomID} setCall={setCall} pc={pc} setConnected={setConnected} handleAlert={handleAlert} handleEndCall={handleEndCall}/>
        : (
          <WaitingRoom roomID={roomID} handleAlert={handleAlert} handleEndCall={handleEndCall} pc={pc}/>
        )}
      
    </>
  );
};
export default MainApp;
