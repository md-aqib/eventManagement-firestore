const admin = require("firebase-admin");
const db = require("../../common/dbSetup");

module.exports = function (req, res) {
  (async () => {
    try {
      if (!req.body.oldPassword || !req.body.newPassword) {
        res.send({ message: "Please enter all details" });
      } else {
        let users = db.collection("register");
        let userData = await users
          .where("password", "==", `${req.body.oldPassword}`)
          .get();
        if (userData.empty) {
          res.send({ message: "Please enter correct oldPassword" });
        } else {
          await db
            .collection("register")
            .doc(req.decoded.userId)
            .update({
              password: req.body.newPassword,
              updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
            });
          return res.send({ message: "New password updated" });
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
