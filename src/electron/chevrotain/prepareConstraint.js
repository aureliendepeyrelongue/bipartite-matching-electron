const { ConstraintLexer } = require("./parser.js");

const getLexer = require("./getLexer.js");

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

module.exports = function(nameSpaceA, nameSpaceB, constraint) {
  var newConstraint = {};
  const baseLexer = getLexer(nameSpaceA, nameSpaceB);
  var baseTokens = baseLexer.tokenize(constraint.value).tokens;
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
  newConstraint.value = preparedConstraintValue;
  newConstraint.tokens = prepareTokens(
    ConstraintLexer.tokenize(newConstraint.value).tokens
  );
  if (constraint.type == "necessary") return newConstraint;
  else {
    return {
      ...newConstraint,
      weight: constraint.weight,
    };
  }
};
