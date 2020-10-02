const db = require("../../common/dbSetup");

//We can not use regex in firestore. We can filter by prefixes only or
//We can use external service like Algolia or ElasticSearch for that.
module.exports = function (req, res) {
  (async () => {
    try {
      if (req.body.search) {
        let events = db.collection("events");
        let data = await events
          .where("eventName", ">=", req.body.search)
          .where("eventName", "<=", req.body.search + "\uf8ff")
          .get();
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
        let myEvents = eventArray.filter((ele) => {
          return ele.createdBy == req.decoded.email;
        });
        let otherEvents = eventArray.filter((ele) => {
          return ele.createdBy != req.decoded.email;
        });
        return res.json({
          message: "My Events",
          myEvents:
            myEvents.length === 0 ? "No Event found created by me." : myEvents,
          otherEvents:
            otherEvents.length === 0
              ? "No Event found created by others."
              : otherEvents,
        });
      } else {
        return res.send({ message: "Please enter search keyword" });
      }
    } catch (e) {
      console.log(e);
      return res.send({
        message: "Something went wrong, Please try again later.",
      });
    }
  })();
};
