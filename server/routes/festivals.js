const express = require("express");
const router = express.Router();
const controller = require("../controllers/festivals");

router.get("/", controller.festivals);
router.get("/:festivalId", controller.festival);

module.exports = router;
