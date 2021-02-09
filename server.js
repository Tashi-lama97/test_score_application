require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

//Routes Import

const candidateRoutes = require("./routes/candidate");
const testScoreRoutes = require("./routes/test_score");

// DB conection
mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Middlewares
app.use(bodyParser.json());
app.use(cors());

//Routes
app.use(candidateRoutes);
app.use(testScoreRoutes);

//Port
port = process.env.PORT || 5000;

//Strarting Server
app.listen(port, () => {
  console.log(`APP is running on port ${port}`);
});
