import { firestore } from "./firebase-config";
const handleCamera = (setCamera,camera,localRef) => {
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
const handleMic = (setMic,mic,localRef) => {
    setMic(!mic);
    let LocalStrea = localRef.current.srcObject;

    if (mic) {
    //  let LocalStrea = localRef.current.srcObject;
      LocalStrea.getAudioTracks()[0].enabled = false;
     // setLocalStream(LocalStrea);
    } else {
      LocalStrea.getAudioTracks()[0].enabled = false;
     // setLocalStream(LocalStream);
    }
};
  const handleEndCall = async (setConnected,localRef,remoteRef,roomID,pc,handleAlert,setCall) => {
    console.log("end call");
   


setConnected(false);
    const tracks = localRef.current.srcObject.getTracks();
    const remoteTracks = remoteRef.current.srcObject.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });

    if (remoteRef.current.srcObject) {
      remoteTracks.forEach((track) => track.stop());
    }

   
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
      setCall(false)
      
    }

    console.log("Call ended");
    console.clear();
    handleAlert("Call Ended");
  };

export {handleCamera,handleMic,handleEndCall}