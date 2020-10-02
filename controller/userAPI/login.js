const db = require("../../common/dbSetup");
const jwt = require("jsonwebtoken");

module.exports = function (req, res) {
  (async () => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.send({ message: "Please enter all details" });
      } else {
        let users = db.collection("register");
        let userData = await users
          .where("email", "==", `${req.body.email}`)
          .get();
        if (userData.empty) {
          return res.send({
            message: "User not registered yet, Please register first",
          });
        } else {
          let userObj = {};
          userData.forEach((doc) => {
            userObj.id = doc.id;
            userObj.name = doc.data().name;
            userObj.email = doc.data().email;
            userObj.password = doc.data().password;
            userObj.phone = doc.data().phone;
          });
          if (userObj.password === req.body.password) {
            //admin.auth().createCustomToken(userObj.id).then(async function (customToken) {})
            // console.log(">>>>>>>>>>>>>>>>>>>???", process.env.SECRETKEY);
            const token = jwt.sign(
              { userId: userObj.id, email: userObj.email },
              req.app.get("secretKey"),
              { expiresIn: "2h" }
            );
            await db.collection("register").doc(userObj.id).update({
              token: token,
            });
            // Send token back to client
            return res.json({
              message: "User loggedin successfully",
              token: token,
            });
          } else {
            return res.send({ message: "Incorrect password" });
          }
        }
      }
    } catch (e) {
      console.log(e);
      return res.send({
        message: "Something went wrong, Please try again later.",
      });
    }
  })();
};
