const express = require("express");
const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");
const { acquire } = require("./lib/record");

const appID = "4afd206b64114dac959fe24b103dd257";
const appCertificate = "ee86b2a63e544c95b5d505a85759ee3d";
const uid = 0;
const role = RtcRole.SUBSCRIBER;

const expirationTimeInSeconds = 3600;
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

const app = express();

app.get("/", (req, res) => {
  res.send("hello video world!");
});

app.use(express.static("public"));

app.get("/record", async (req, res) => {
  const response = await acquire({ appID });
  res.json(response.data);
});

app.get("/:channelName", (req, res) => {
  const { channelName } = req.params;
  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
  console.log("Token With Integer Number Uid: " + token);
  res.send(`
    <div id="${uid}" class="publisher"></div>
    <script>const token = '${token}'; const appId = '${appID}'; const channel = '${channelName}'; const uid = ${uid}</script>
    <script src="https://download.agora.io/sdk/release/AgoraRTC_N-4.7.2.js"></script>
    <script src=/app.js></script>
    <style>
        .publisher {
            width: 300px;
            height: 200px;
            position: fixed;
            right: 10px;
            bottom: 10px;
        }
    </style>
    `);
});

app.listen(3003);
