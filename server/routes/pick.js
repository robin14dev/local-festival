const express = require("express");
const router = express.Router();
const addPick = require("../controllers/picks/addPick");
const deletePick = require("../controllers/picks/deletePick");
const getPick = require("../controllers/picks/getPick");

router.get("/", getPick);
router.post("/", addPick);
router.delete("/", deletePick);

module.exports = router;
