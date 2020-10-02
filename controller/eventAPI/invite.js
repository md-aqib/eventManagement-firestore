const admin = require("firebase-admin");
const db = require("../../common/dbSetup");

module.exports = function (req, res) {
  (async () => {
    try {
      if (!req.body.inviteEmail || !req.params.eventId) {
        return res.send({ message: "Please enter all details" });
      } else {
        let users = db.collection("register");
        let userData = await users
          .where("email", "==", `${req.body.inviteEmail}`)
          .get();
        if (userData.empty) {
          return res.send({ message: "Invite email is not registered" });
        }
        let events = db.collection("events");
        let eventData = await events
          .where("invited", "array-contains", `${req.body.inviteEmail}`)
          .get();
        console.log(eventData.empty);
        if (eventData.empty) {
          await db
            .collection("events")
            .doc(req.params.eventId)
            .update({
              invited: admin.firestore.FieldValue.arrayUnion(
                req.body.inviteEmail
              ),
            });
          return res.send({ message: "Invited successfully" });
        } else {
          return res.send({ message: "Person already invited" });
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
