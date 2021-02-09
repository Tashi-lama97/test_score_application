const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { insertCandidate } = require("../controllers/candidate");
const { route } = require("./test_score");

router.post(
  "/candidate/insert",
  [
    check("name", "name should be at least 3 char").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
  ],
  insertCandidate
);

module.exports = router;
