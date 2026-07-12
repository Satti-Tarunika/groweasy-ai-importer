const express = require("express");
const router = express.Router();

const { mapHeaders } = require("../controllers/aiController");

router.post("/map", mapHeaders);

module.exports = router;