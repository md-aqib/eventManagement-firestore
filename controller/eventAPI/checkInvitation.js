const db = require("../../common/dbSetup");

module.exports = function (req, res) {
  (async () => {
    try {
      let events = db.collection("events");
      let eventData = await events.where(
        "invited",
        "array-contains",
        `${req.decoded.email}`
      );
      let data = await eventData.orderBy("date").get();
      if (data.empty) {
        return res.json({
          message: "No invitation found",
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
        message: "Event Invitations",
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
