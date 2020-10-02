const db = require("../common/dbSetup");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  (async () => {
    try {
      let idToken = req.headers["token"];
      if (idToken) {
        // idToken comes from the client app
        // decodedToken = await admin.auth().verifyIdToken(idtoken);
        // let uid = decodedToken.uid;
        let decoded = await jwt.verify(idToken, req.app.get("secretKey"));
        let users = db.collection("register");
        let userData = await users
          .where("email", "==", `${decoded.email}`)
          .get();
        let userObj = {};
        userData.forEach((doc) => {
          userObj.token = doc.data().token;
        });
        if (userObj.token == idToken) {
          req.decoded = decoded;
          next();
        } else {
          return res.send({ message: "unauthorized token" });
        }
      } else {
        res.send({ message: "Token not found" });
      }
    } catch (e) {
      console.log(e);
      return res.send({ message: "Something went wrong" });
    }
  })();
};
