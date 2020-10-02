const db = require("../../common/dbSetup");

module.exports = function (req, res) {
  (async () => {
    try {
      let events = db.collection("events");
      let eventData = await events.where(
        "createdBy",
        "==",
        `${req.decoded.email}`
      );
      let data = await eventData.orderBy("date").get();
      if (data.empty) {
        res.json({
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
        message: "My Events",
        eventData: eventArray,
      });
    } catch (e) {
      console.log(e);
      return res.send({
        message: "Something went wrong, Please try again later.",
      });
    }
  })();
};
