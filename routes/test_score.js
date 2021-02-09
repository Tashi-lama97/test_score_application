const express = require("express");
const { getCandidateById, getCandidate } = require("../controllers/candidate");
const {
  setScoreRoundOne,
  setScoreRoundTwo,
  setScoreRoundThree,
  getTestSummery,
} = require("../controllers/test_score");

const router = express.Router();

// Params
router.param("candidateId", getCandidateById);

router.post("/score/insert/roundone/", setScoreRoundOne);
router.post("/score/insert/roundtwo/:candidateId", setScoreRoundTwo);
router.post("/score/insert/roundthree/:candidateId", setScoreRoundThree);
router.get("/testsummery", getTestSummery);

module.exports = router;
