const admin = require("firebase-admin");
const db = require("../../common/dbSetup");

module.exports = function (req, res) {
  (async () => {
    try {
      if (!req.body.eventName || !req.body.description || !req.body.date) {
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
          .where("eventName", "==", `${req.body.eventName}`)
          .get();
        if (eventData.empty) {
          await db.collection("events").add({
            eventName: req.body.eventName,
            description: req.body.description,
            createdBy: req.decoded.email,
            invited: [req.body.inviteEmail],
            date: admin.firestore.Timestamp.fromDate(
              new Date(req.body.date + "T00:00:00")
            ),
          });
          return res.send({ message: "Event successfully added." });
        } else {
          return res.send({ message: "Event already added" });
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
