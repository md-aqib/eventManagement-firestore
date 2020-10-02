const db = require("../../common/dbSetup");
const admin = require("firebase-admin");

module.exports = function (req, res) {
  (async () => {
    try {
      if (req.body.startDate && req.body.endDate) {
        let start = new Date(req.body.startDate);
        let end = new Date(req.body.endDate);
        let events = db.collection("events");
        let eventData1 = await events.where("date", ">", start);
        let data = await eventData1.where("date", "<", end).get();
        if (data.empty) {
          return res.json({
            message: "No event found",
          });
        }
        let eventArray = [];
        let eventObj = {};
        data.forEach((doc) => {
          eventObj.eventName = doc.data().eventName;
          eventObj.description = doc.data().description;
          eventObj.date = doc.data().date;
          eventObj.inviteEmail = doc.data().inviteEmail;
          eventObj.createdBy = doc.data().createdBy;
          eventArray.push(eventObj);
          return eventArray;
        });
        return res.json({
          message: "Event list",
          eventData: eventArray,
        });
      } else {
        return res.json({
          message: "Please enter all details",
        });
      }
    } catch (e) {
      console.log(e);
      return res.send({
        message: "Something went wrong, Please try again later.",
      });
    }
  })();
};
