import { firestore } from "./firebase-config";
const init = async (handleAlert,localRef,localStream,remoteRef,remoteStream,setConnected,pc) => {
    try {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!navigator.getUserMedia) {
            handleAlert("Your Browser Does Not Support Video Calling");
        }
        else {
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            localRef.current.srcObject = stream;
            localStream = stream;
            remoteStream = new MediaStream();
            remoteRef.current.srcObject = remoteStream;
            localStream.getTracks().forEach((track) => {
                pc.addTrack(track, localStream);
            });
            pc.ontrack = (event) => {
                console.log("on track");
                setConnected(true);
                event.streams[0].getTracks().forEach((track) => {
                    console.log(track);
                    remoteStream.addTrack(track);
                });
            };
            
            

        }
            
        
        
    } catch (error) {
        console.log(error.message)
        
    }
}
const createRoom = async (roomID, registerPeerConnectionListeners, pc) => {
  // creating offers
  try {
    registerPeerConnectionListeners();
    const callDoc = firestore.collection("calls").doc(roomID);
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        offerCandidates.add(event.candidate.toJSON());
      }
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {sdp: offerDescription.sdp,type: offerDescription.type,};
    await callDoc.set({ offer });

    callDoc.onSnapshot(async (snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        console.log("call answered");
        const answerDescription = new RTCSessionDescription(data.answer);
        await pc.setRemoteDescription(answerDescription);
      }
    });
    
    answerCandidates.onSnapshot(async (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let data = change.doc.data();
        if (change.type === "added") {
            pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  } catch (err) {
    console.log(err.message);
  }
};

const joinRoom = async (roomID, registerPeerConnectionListeners, pc) => {
  try {
    registerPeerConnectionListeners();
    const callDoc = firestore.collection("calls").doc(roomID);
    const answerCandidates = callDoc.collection("answerCandidates");

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        answerCandidates.add(event.candidate.toJSON());
      }
    };

    const offerDescription = ((await callDoc.get()).data()).offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {type: answerDescription.type,sdp: answerDescription.sdp,};
    await callDoc.update({ answer });

    callDoc.collection("offerCandidates").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  } catch (err) {
    console.log(err.message);
  }
};
// const hangUP = async () => {
//     const tracks = localRef.current.srcObject.getTracks();
//     tracks.forEach((track) => {
//       track.stop();
//     });

//     if (remoteStream) {
//       remoteStream.getTracks().forEach((track) => track.stop());
//     }

//     if (pc) {
//       pc.close();
//     }

//     // Delete room on hangup
//     if (roomID) {
//       const db = firestore;
//       const roomRef = db.collection("calls").doc(roomID);
//       const calleeCandidates = await roomRef
//         .collection("offerCandidates")
//         .get();
//       calleeCandidates.forEach(async (candidate) => {
//         await candidate.delete();
//       });
//       const callerCandidates = await roomRef
//         .collection("answerCandidates")
//         .get();
//       callerCandidates.forEach(async (candidate) => {
//         await candidate.delete();
//       });
//       await roomRef.delete();
//     }

//     document.location.reload(true);
//   };
export { createRoom, joinRoom,init };
