const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

exports.serverSideGet = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      const res = await axios.get(request.body.data);
      response.status(200).json({ data: res.data });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  });
});
