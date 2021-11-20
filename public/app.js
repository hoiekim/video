const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
const publisher = document.querySelector(".publisher");

client.on("user-published", (user, mediaType) => {
  client.subscribe(user, mediaType).then(() => {
    if (mediaType === "video") {
      // Get the RemoteVideoTrack object in the AgoraRTCRemoteUser object.
      const remoteVideoTrack = user.videoTrack;
      // Dynamically create a container in the form of a DIV element for playing the remote video track.
      const remotePlayerContainer = document.createElement("div");
      // Specify the ID of the DIV container. You can use the uid of the remote user.
      remotePlayerContainer.id = user.uid.toString();
      remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
      remotePlayerContainer.style.width = "640px";
      remotePlayerContainer.style.height = "480px";
      document.body.append(remotePlayerContainer);

      // Play the remote video track.
      // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
      remoteVideoTrack.play(remotePlayerContainer);

      // Or just pass the ID of the DIV container.
      // remoteVideoTrack.play(playerContainer.id);
    }
    if (mediaType === "audio") {
      // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
      const remoteAudioTrack = user.audioTrack;
      // Play the remote audio track. No need to pass any DOM element.
      remoteAudioTrack.play();
    }
  });
});

client.on("user-unpublished", (user) => {
  // Get the dynamically created DIV container.
  const remotePlayerContainer = document.getElementById(user.uid);
  // Destroy the container.
  remotePlayerContainer.remove();
});

client
  .join(appId, channel, token, uid)
  .then(() => {
    return Promise.all([
      AgoraRTC.createMicrophoneAudioTrack(),
      AgoraRTC.createCameraVideoTrack(),
    ]);
  })
  .then((array) => {
    const [localAudio, localVideo] = array;
    client.publish(array);
    localVideo.play(publisher);
  });
