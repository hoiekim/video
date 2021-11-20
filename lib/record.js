const axios = require("axios");

const restKey = "ad4d0bd6a0644abdbda566d124a590c1";
const restSecret = "ae7c8caef3ee47788a6771e188fe93eb";

const plainCredential = restKey + ":" + restSecret;
const encodedCredential = Buffer.from(plainCredential).toString("base64");
const authorizationField = "Basic " + encodedCredential;

const acquire = ({ appID }) => {
  return axios(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/acquire`,
    {
      method: "post",
      headers: {
        Authorization: authorizationField,
        "Content-type": "application/json;charset=utf-8",
      },
      data: {
        cname: "httpClient463224",
        uid: "527841",
        clientRequest: {
          resourceExpiredHour: 24,
          scene: 0,
        },
      },
    }
  );
};

module.exports = { acquire };
