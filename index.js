const functions = require("firebase-functions");
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({ origin: true }));

app.set("secretKey", require("./common/config").SECRETKEY);

app.use("/api", require("./controller/routes"));

//export the api to the firebase cloud function
exports.app = functions.https.onRequest(app);
