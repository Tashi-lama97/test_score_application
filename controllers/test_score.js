const TestScore = require("../models/test_score");
const { check, validationResult } = require("express-validator");

exports.setScoreRoundOne = (req, res) => {
  TestScore.findOne({ candidate: req.body.candidate }).exec(
    (error, testScore) => {
      if (testScore) {
        res.status(409).json({
          error: "Scores already given to the candidate",
        });
      } else {
        const newTestScore = new TestScore(req.body);
        newTestScore.save((error, score) => {
          if (error) {
            res.status(400).json({
              error: error,
            });
          }
          res.status(200).json({
            score,
          });
        });
      }
    }
  );
};

exports.setScoreRoundTwo = (req, res) => {
  TestScore.findOne({ candidate: req.candidate._id }).exec(
    (error, testScore) => {
      if (error || !testScore) {
        res.status(404).json({
          error: "Unable to fine Test Score for the candidate",
        });
      }
      if (testScore.round_two_score) {
        res.status(409).json({
          error: "Test Score for Round two is already Given",
        });
      } else {
        testScore.round_two_score = req.body.round_two;
        testScore.total_score += req.body.round_two;
        testScore.save((error, score) => {
          if (error) {
            res.status(400).json({
              error: "Unable to insert score for second round",
            });
          }
          res.status(200).json({
            score: score.round_two_score,
            candidate: score.candidate,
          });
        });
      }
    }
  );
};
exports.setScoreRoundThree = (req, res) => {
  TestScore.findOne({ candidate: req.candidate._id }).exec(
    (error, testScore) => {
      if (error || !testScore) {
        res.status(404).json({
          error: "Unable to fine Test Score for the candidate",
        });
      }
      if (testScore.round_three_score) {
        res.status(409).json({
          error: "Test Score for Round three is already Given",
        });
      } else {
        testScore.round_three_score = req.body.round_three;
        testScore.total_score += req.body.round_three;
        testScore.save((error, score) => {
          if (error) {
            res.status(400).json({
              error: "Unable to insert score for Third round",
            });
          }
          res.status(200).json({
            score: score.round_three_score,
            candidate: score.candidate,
          });
        });
      }
    }
  );
};

exports.getTestSummery = (req, res) => {
  TestScore.find()
    .sort({ total_score: -1 })
    .limit(1)
    .populate("candidate", "name email")
    .exec((error, candidate) => {
      if (error) {
        res.status(400).json({
          error: "something went wrong",
        });
      } else {
        TestScore.aggregate([
          {
            $group: {
              _id: "all_candidate",
              round_one_average_score: { $avg: "$round_one_score" },
              round_two_average_score: { $avg: "$round_two_score" },
              round_three_average_score: { $avg: "$round_three_score" },
            },
          },
        ]).exec((error, data) => {
          if (error) {
            res.status(400).json({
              error: "something went wrong s",
            });
          } else {
            res.json({
              round_one_average_score: data[0].round_one_average_score,
              round_two_average_score: data[0].round_two_average_score,
              round_three_average_score: data[0].round_three_average_score,
              highest_scoring_candidate: {
                name: candidate[0].candidate.name,
                email: candidate[0].candidate.email,
                score: candidate[0].total_score,
              },
            });
          }
        });
      }
    });
};
