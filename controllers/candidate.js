const Candidate = require("../models/candidate");
const { check, validationResult } = require("express-validator");

// Get candidate by id
exports.getCandidateById = (req, res, next, id) => {
  Candidate.findById(id).exec((err, candidate) => {
    if (err) {
      res.status(401).json({
        error: "Error finding user in DB",
      });
    }
    req.candidate = candidate;
    next();
  });
};

exports.insertCandidate = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors,
    });
  }

  const candidate = new Candidate(req.body);
  candidate.save((error, candidate) => {
    if (error) {
      res.status(400).json({
        error: error,
      });
    }
    res.status(200).json({
      name: candidate.name,
      email: candidate.email,
      id: candidate._id,
    });
  });
};
