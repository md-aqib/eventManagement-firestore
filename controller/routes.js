const express = require("express");
const router = express.Router();
const tokenVerify = require("../common/tokenVerify");

//user route
router.post("/register", require("./userAPI/register"));
router.post("/login", require("./userAPI/login"));
router.put("/logout", tokenVerify, require("./userAPI/logout"));
router.put("/changepassword", tokenVerify, require("./userAPI/changePassword"));
router.put("/resetpassword", require("./userAPI/resetAndUpdatePass"));

//event route
router.post("/createevent", tokenVerify, require("./eventAPI/createEvent"));
router.get(
  "/checkinvitation",
  tokenVerify,
  require("./eventAPI/checkInvitation")
);
router.post("/listevent", tokenVerify, require("./eventAPI/listEvent"));
router.get("/myevents", tokenVerify, require("./eventAPI/myEvents"));
router.post("/searchevents", tokenVerify, require("./eventAPI/searchEvent"));
router.put("/invite/:eventId", tokenVerify, require("./eventAPI/invite"));

module.exports = router;
