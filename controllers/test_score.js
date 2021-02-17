const TestScore = require("../models/test_score");
const { validationResult } = require("express-validator");

exports.setScore = (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json(error);
  }
  const round = req.body.round.toLowerCase().trim();
  const id = req.body.candidateId;

  switch (round) {
    case "one":
      let data = {
        candidate: req.body.candidateId,
        round_one_score: req.body.score,
        total_score: req.body.score,
      };
      const testScore = new TestScore(data);
      testScore.save((error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Unable to set score",
          });
        }
        return res.status(200).json({
          message: "Score added Successfully",
        });
      });
      break;
    case "two":
      TestScore.find({ candidate: id }).exec((error, data) => {
        if (error) {
          return res.status(401).json({
            message:
              "unable to find candidate, candidate might have failed in first round",
          });
        } else {
          data[0].round_two_score = req.body.score;
          data[0].total_score = data[0].round_one_score + req.body.score;
          data[0].save((error, result) => {
            if (error) {
              return res.status(400).json({
                message: "Unable to save score",
              });
            }
            return res.status(200).json({
              message: "Successfully Updated ",
            });
          });
        }
      });
      break;
    case "three":
      TestScore.find({ candidate: id }).exec((error, data) => {
        if (error) {
          return res.status(401).json({
            message:
              "unable to find candidate, candidate might have failed in second round",
          });
        } else {
          data[0].round_three_score = req.body.score;
          data[0].total_score =
            data[0].round_one_score + data[0].round_two_score + req.body.score;
          data[0].save((error, data) => {
            if (error) {
              return res.status(400).json({
                message: "Unable to save score",
              });
            }
            return res.status(200).json({
              message: "Successfully Updated ",
            });
          });
        }
      });
      break;

    default:
      res.status(400).json({ message: "plese spacify the round" });
      break;
  }
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
