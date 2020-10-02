const admin = require("firebase-admin");
const db = require("../../common/dbSetup");
const mailer = require("../../common/nodemailer");

// Generate new password
const generatePass = () => {
  let newPassword = "Abcd@" + Math.floor(Math.random() * 10000);
  return newPassword;
};

module.exports = function (req, res) {
  (async () => {
    try {
      if (!req.body.email) {
        res.send({ message: "Please enter all details" });
      } else {
        let users = db.collection("register");
        let userData = await users
          .where("email", "==", `${req.body.email}`)
          .get();
        if (userData.empty) {
          res.send({ message: "User not found" });
        } else {
          let userObj = {};
          userData.forEach((doc) => {
            userObj.id = doc.id;
          });
          let generatedPass = await generatePass();
          await mailer.sendMails(
            req.body.email,
            `Your New Password is: ${generatedPass}, You can change your password after login.`
          );
          await db
            .collection("register")
            .doc(userObj.id)
            .update({
              password: generatedPass,
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
