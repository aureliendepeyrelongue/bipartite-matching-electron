const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Campaign = require("../models/Campaign");
const User = require("../models/User");
const MenteeAnswer = require("../models/answers/MenteeAnswer");
const MentorAnswer = require("../models/answers/MentorAnswer");
const MatchingProcess = require("./MatchingProcess");
const prepareConstraint = require("../interpreter/chevrotain/prepareConstraint");
const parseInput = require("../interpreter/chevrotain/parser.test.js");
dotenv.config();

test("test matching", async () => {
  try {
    const db = await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to db.");
    await testMatching();
    expect(true).toBe(true);
  } catch (err) {
    console.log(err);
  }
});

async function testMatching() {
  var menteeAnswers = await MenteeAnswer.find({});
  var mentorAnswers = await MentorAnswer.find({});
  var campaign = await Campaign.findOne({ name: "Campagne de mentoring 1" });

  var necessaryConstraints = campaign.constraints.filter(
    (c) => c.type == "necessary"
  );
  var secondaryConstraints = campaign.constraints.filter(
    (c) => c.type == "secondary"
  );

  for (let i = 0; i < necessaryConstraints.length; i++) {
    necessaryConstraints[i] = prepareConstraint(necessaryConstraints[i]);
  }

  for (let i = 0; i < secondaryConstraints.length; i++) {
    secondaryConstraints[i] = prepareConstraint(secondaryConstraints[i]);
  }

  //console.log(necessaryConstraints);

  var mentees = menteeAnswers.map((mentee) => mentee.fields);
  var mentors = mentorAnswers.map((mentor) => mentor.fields);

  /*
  mentees.forEach((mentee) => {
    mentors.forEach((mentor) => {
      parseInput(necessaryConstraints[0].value, mentee, mentor);
      console.log(mentee["aa:age"]);
      console.log(mentor["bb:age"]);
    });
  });*/

  ///console.log(necessaryConstraints[0].value);

  //console.log(mentees);

  var exit = await mongoose.connection.close();

  var matchingProcess = new MatchingProcess(
    mentees,
    mentors,
    necessaryConstraints,
    secondaryConstraints
  );
  matchingProcess.startMatchingProcess();
  var result = matchingProcess.getResult();

  console.log(result.couples.length);
  console.log(result.couples[0]);
}
