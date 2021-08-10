const { ConstraintParser, ConstraintLexer } = require("./parser");
const prepareConstraint = require("./prepareConstraint");

var parser = new ConstraintParser();

const mentee = {
    "aa:age": 31,
    "aa:jobLevel": 15,
    "aa:direction": "direction_F",
    "aa:branch": "branch_F",
    "aa:region": "region_A",
    "aa:city": "city_F",
    "aa:can_speak": "english",
    "aa:other_participant_gender": "male",
    "aa:mentoring_type": "both",
    "aa:firstName": "Adkins",
    "aa:lastName": "Francis",
    "aa:gender": "Male",
    "aa:email": "adkinsfrancis@quarex.com",
    "aa:empty": "",
  },
  mentor = {
    "bb:age": 34,
    "bb:other_participant_gender": "a",
    "bb:jobLevel": 56,
    "bb:name": "angel del mar l'avion est superbe vraiment,$%^^ !!! é#àdsf%",
  };

function evalConstraint(constraint, mentee, mentor) {
  console.log(constraint);
  parser.set(constraint.tokens, mentee, mentor);
  console.log(parser.getResult());
  if (parser.errors.length > 0) {
    console.log(parser.errors);
    throw new Error("sad sad panda, Parsing errors detected");
  }
}

const constraints = [
  {
    type: "necessary",
    value: `mentee.direction not "direction_Fd" and 
    ( mentee.age = 31 or mentor.age = 35 and
      (mentor.name = "angeli" or mentee.can_speak="englishi"))`,
  },
  {
    type: "necessary",
    value: `mentee.empty not "test"`,
  },
];

const preparedConstraints = constraints.map((c) =>
  prepareConstraint("mentee", "mentor", c)
);

preparedConstraints.forEach((c) => {
  evalConstraint(c, mentee, mentor);
});

module.exports = evalConstraint;
