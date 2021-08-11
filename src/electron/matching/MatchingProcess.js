const { ConstraintParser } = require("../chevrotain/parser");
const prepareConstraint = require("../chevrotain/prepareConstraint");
const parser = new ConstraintParser();

class MatchingProcess {
  constructor(
    mentees,
    mentors,
    necessaryConstraints,
    secondaryConstraints,
    options
  ) {
    this.mentees = mentees;
    this.mentors = mentors;
    this.necessaryConstraints = necessaryConstraints;
    this.secondaryConstraints = secondaryConstraints;
    this.options = options;
    this.result = null;
  }

  prepareConstraints() {
    this.necessaryConstraints = this.necessaryConstraints.map((c) => {
      return prepareConstraint("mentee", "mentor", c);
    });
    this.secondaryConstraints = this.secondaryConstraints.map((c) => {
      return prepareConstraint("mentee", "mentor", c);
    });
  }

  prepareData(menteesColumns, mentorsColumns) {
    this.mentees = this.mentees.map((mentee) => {
      let newMentee = {};
      menteesColumns.forEach((col) => {
        newMentee["aa:" + col.target] = mentee[col.origin];
      });
      return newMentee;
    });

    this.mentors = this.mentors.map((mentor) => {
      let newMentor = {};
      mentorsColumns.forEach((col) => {
        newMentor["bb:" + col.target] = mentor[col.origin];
      });
      return newMentor;
    });

    menteesColumns.forEach((col) => {
      if (col.type === "number") {
        this.mentees.forEach((mentee, index) => {
          this.mentees[index]["aa:" + col.target] = parseFloat(
            mentee["aa:" + col.target]
          );
        });
      }
    });

    mentorsColumns.forEach((col) => {
      if (col.type === "number") {
        this.mentors.forEach((mentor, index) => {
          this.mentors[index]["bb:" + col.target] = parseFloat(
            mentor["bb:" + col.target]
          );
        });
      }
    });
  }

  startMatchingProcess() {
    // let's match mentees and mentors
    var mentorsAndWeightsByMentee = [];
    this.mentees.forEach((mentee) => {
      var selectedMentorsAndWeights = [];
      this.mentors.forEach((mentor) => {
        // necessary constraints test
        if (this.getNecessaryConstraintsResponse(mentee, mentor)) {
          // Rating constraints
          var weight = this.getSecondaryConstraintsResponse(mentee, mentor);
          // keep in memory weights and mentors
          selectedMentorsAndWeights.push({
            weight,
            mentor,
          });
        }
      });
      // let's sort mentors by weights from the highest to the lowest
      selectedMentorsAndWeights.sort(function(a, b) {
        return b.weight - a.weight;
      });
      // we keep and associate a mentee with a list of potential mentors
      mentorsAndWeightsByMentee.push({
        mentee,
        mentorsAndWeights: selectedMentorsAndWeights,
      });
    });
    // let's priorize mentees with the smallest number of mentors and French Nationality
    mentorsAndWeightsByMentee.sort((a, b) => {
      return a.mentorsAndWeights.length - b.mentorsAndWeights.length;
    });
    // let's create couples
    var couples = [];
    var discharges = { mentees: [], mentors: [] };

    for (let i = 0; i < mentorsAndWeightsByMentee.length; i++) {
      var element = mentorsAndWeightsByMentee[i];
      var mentorToKeep = null;

      for (let j = 0; j < element.mentorsAndWeights.length; j++) {
        var mentor = element.mentorsAndWeights[j].mentor;
        if (!this.isMentorAlreadyInCouple(mentor, couples)) {
          mentorToKeep = mentor;
          break;
        }
      }
      if (mentorToKeep == null) {
        // let's start backtrackng
        if (couples.length > 0) {
          mentorToKeep = this.getMentorByBackTracking(
            mentorsAndWeightsByMentee,
            couples,
            element
          );
          if (mentorToKeep == null) {
            discharges.mentees.push(element.mentee);
          } else {
            couples.push({ mentee: element.mentee, mentor: mentorToKeep });
          }
        } else {
          discharges.mentees.push(element.mentee);
        }
      } else {
        couples.push({ mentee: element.mentee, mentor: mentorToKeep });
      }
    }
    //  get mentors discharges
    this.mentors.forEach((mentor) => {
      var matched = false;
      for (let i = 0; i < couples.length; i++) {
        var couple = couples[i];
        if (mentor == couple.mentor) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        discharges.mentors.push(mentor);
      }
    });

    this.result = {
      couples,
      discharges,
    };
  }

  getResult() {
    return this.result;
  }
  getNecessaryConstraintsResponse(mentee, mentor) {
    var test = true;
    for (let i = 0, n = this.necessaryConstraints.length; test && i < n; i++) {
      const constraint = this.necessaryConstraints[i];

      parser.set(constraint.tokens, mentee, mentor);
      test &= parser.getResult();
    }
    return test;
  }
  getSecondaryConstraintsResponse(mentee, mentor) {
    var weight = 0;
    this.secondaryConstraints.forEach((constraint) => {
      parser.set(constraint.tokens, mentee, mentor);
      weight += parser.getResult() ? constraint.weight : 0;
    });
    return weight;
  }
  getMentorByBackTracking(mentorsAndWeightsByMentee, couples, element) {
    var mentorToGet = null;
    for (let i = couples.length - 1; i >= 0; i--) {
      var previousCouple = couples[i];
      if (this.hasMatchingMentor(couples[i], element)) {
        // if previous taken mentor is matching
        var previousEl = this.getRatingElementByMentee(
          mentorsAndWeightsByMentee,
          previousCouple
        );
        var freeMentor = this.getOneMentorFree(previousEl, couples);
        // get a free mentor if exists
        if (freeMentor != null) {
          mentorToGet = couples[i].mentor;
          couples[i].mentor = freeMentor;
          break;
        }
      }
    }
    return mentorToGet;
  }

  getRatingElementByMentee(mentorsAndWeightsByMentee, previousCouple) {
    var element = null;
    for (let i = 0; i < mentorsAndWeightsByMentee.length; i++) {
      element = mentorsAndWeightsByMentee[i];
      if (element.mentee == previousCouple.mentee) {
        break;
      }
    }
    return element;
  }

  hasMatchingMentor(previousCouple, element) {
    var test = false;
    for (let i = 0; i < element.mentorsAndWeights.length; i++) {
      var mentor = element.mentorsAndWeights[i].mentor;
      if (previousCouple.mentor == mentor) {
        test = true;
        break;
      }
    }
    return test;
  }

  getOneMentorFree(previousEl, couples) {
    var mentorToKeep = null;
    for (let i = 0; i < previousEl.mentorsAndWeights.length; i++) {
      var mentor = previousEl.mentorsAndWeights[i].mentor;
      if (!this.isMentorAlreadyInCouple(mentor, couples)) {
        mentorToKeep = mentor;
        break;
      }
    }
    return mentorToKeep;
  }

  isMentorAlreadyInCouple(mentor, couples) {
    for (let i = 0; i < couples.length; i++) {
      const couple = couples[i];
      if (couple.mentor == mentor) {
        return true;
      }
    }
  }
}

module.exports = MatchingProcess;
