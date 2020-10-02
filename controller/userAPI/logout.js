const db = require("../../common/dbSetup");

module.exports = function (req, res) {
  (async () => {
    console.log(req.decoded);
    try {
      await db.collection("register").doc(req.decoded.userId).update({
        token: null,
      });
      return res.status(200).send({ message: "Logout successfully" });
    } catch (e) {
      console.log(e);
      return res.status(500).send("Something went wrong");
    }
  })();
};
