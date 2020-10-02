const admin = require("firebase-admin");
const db = require("../../common/dbSetup");

module.exports = function (req, res) {
  (async () => {
    try {
      if (
        !req.body.name ||
        !req.body.email ||
        !req.body.password ||
        !req.body.phone
      ) {
        res.send({ message: "Please enter all details" });
      } else {
        let users = db.collection("register");
        let userData = await users
          .where("email", "==", `${req.body.email}`)
          .get();
        if (!userData.empty) {
          res.send({ message: "User already registered" });
        } else {
          await db.collection("register").add({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            createdAt: admin.firestore.Timestamp.fromDate(new Date()),
          });
          return res.send({ message: "User successfully registered." });
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
