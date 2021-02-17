const express = require("express");
const { setScore, getTestSummery } = require("../controllers/test_score");
const { check } = require("express-validator");

const router = express.Router();

// Params

router.post(
  "/score/insert",
  [
    check("round", "Round should be specified as (one, two, three)")
      .isString()
      .not()
      .isEmpty(),
  ],
  setScore
);

router.get("/testsummery", getTestSummery);

module.exports = router;
