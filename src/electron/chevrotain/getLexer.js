const { createToken, Lexer } = require("chevrotain");
module.exports = (partANamespace, partBNamespace) => {
  var stringLiteralPattern = /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/;

  var NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
  });

  const PartAVar = createToken({
    name: "PartAVar",
    pattern: new RegExp(`${partANamespace}.[a-zA-Z_]{1,}[a-zA-Z0-9_]*`),
  });

  const PartBVar = createToken({
    name: "PartBVar",
    pattern: new RegExp(`${partBNamespace}.[a-zA-Z_]{1,}[a-zA-Z0-9_]*`),
  });

  const Plus = createToken({
    name: "Plus",
    pattern: "+",
  });

  const Not = createToken({
    name: "Not",
    pattern: "not",
  });

  const Times = createToken({
    name: "Times",
    pattern: "*",
  });

  const Minus = createToken({
    name: "Minus",
    pattern: "-",
  });

  const Divided = createToken({
    name: "Divided",
    pattern: /\//,
  });
  var StringLiteral = createToken({
    name: "StringLiteral",
    pattern: stringLiteralPattern,
  });

  const Equals = createToken({
    name: "Equals",
    pattern: "=",
  });

  const InfEquals = createToken({
    name: "InfEquals",
    pattern: "<=",
  });
  const InfStrict = createToken({
    name: "InfStrict",
    pattern: "<",
  });
  const SupEquals = createToken({
    name: "SupEquals",
    pattern: ">=",
  });
  const SupStrict = createToken({
    name: "SupStrict",
    pattern: ">",
  });

  const And = createToken({
    name: "And",
    pattern: "and",
  });

  const Or = createToken({
    name: "Or",
    pattern: "or",
  });

  const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
  });

  const NextLine = createToken({
    name: "NextLine",
    pattern: /\n/,
    group: Lexer.SKIPPED,
  });

  var allTokens = [
    WhiteSpace,
    NumberLiteral,
    StringLiteral,
    Or,
    And,
    Not,
    NextLine,
    PartAVar,
    PartBVar,
    Plus,
    Minus,
    Times,
    Divided,
    Equals,
    InfEquals,
    InfStrict,
    SupEquals,
    SupStrict,
  ];

  return new Lexer(allTokens, { ensureOptimizations: true });
};
