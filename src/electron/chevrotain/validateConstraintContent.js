const { ConstraintLexer, ConstraintParser } = require("./parser.js");

const getLexer = require("./getLexer.js");
const MatchingProcess = require("../matching/MatchingProcess.js");

function prepareTokens(tokens) {
  return tokens.map((token) => {
    if (token.tokenType.name === "StringLiteral") {
      return {
        ...token,
        preparedImage: token.image.slice(1, -1),
      };
    } else {
      return token;
    }
  });
}

module.exports = function(nameSpaceA, nameSpaceB, constraintContent) {
  try {
    var newConstraint = {};
    const baseLexer = getLexer(nameSpaceA, nameSpaceB);
    var baseTokens = baseLexer.tokenize(constraintContent).tokens;
    let preparedConstraintValue = "";
    baseTokens.forEach((token) => {
      let image;
      if (
        token.tokenType.name === "PartAVar" ||
        token.tokenType.name === "PartBVar"
      ) {
        image = token.image
          .replace(new RegExp(nameSpaceA + ".", "g"), "aa:")
          .replace(new RegExp(nameSpaceB + ".", "g"), "bb:");
      } else {
        image = token.image;
      }
      preparedConstraintValue += " " + image;
    });
    newConstraint.content = preparedConstraintValue;
    const lexerResult = ConstraintLexer.tokenize(newConstraint.content);
    newConstraint.tokens = prepareTokens(lexerResult.tokens);
    const parser = new ConstraintParser();
    parser.set(newConstraint.tokens, {}, {});
    const res = parser.getResult();
    if (
      res === undefined ||
      baseTokens
        .map((t) => t.image)
        .join("")
        .split(" ")
        .join("").length !== constraintContent.split(" ").join("").length
    )
      return { message: "validation-failed" };
    else {
      return { message: "validation-success" };
    }
  } catch (err) {
    return err;
  }
};
