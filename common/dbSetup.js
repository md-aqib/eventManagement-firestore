const admin = require("firebase-admin");
const serviceAccount = require("../dummy-ad0ff-firebase-adminsdk-5ue4l-72ce6f1616.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
});
const db = admin.firestore();

module.exports = db;
