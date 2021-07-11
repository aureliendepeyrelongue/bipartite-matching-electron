const { createToken, Lexer, EmbeddedActionsParser } = require("chevrotain");
// We specify the "longer_alt" property to resolve keywords vs identifiers ambiguity.
// See: https://github.com/chevrotain/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js
var stringLiteralPattern = /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/;

var NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
});

const LPLitteral = createToken({
  name: "LPLitteral",
  pattern: "(",
});

const RPLitteral = createToken({
  name: "RPLitteral",
  pattern: ")",
});

const MenteeVar = createToken({
  name: "MenteeVar",
  pattern: /aa:[a-zA-Z_]{1,}[a-zA-Z0-9_]*/,
});

const MentorVar = createToken({
  name: "MentorVar",
  pattern: /bb:[a-zA-Z_]{1,}[a-zA-Z0-9_]*/,
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
  NextLine,
  Or,
  And,
  Not,
  MenteeVar,
  MentorVar,
  Plus,
  Minus,
  Times,
  Divided,
  Equals,
  InfEquals,
  InfStrict,
  SupEquals,
  SupStrict,
  LPLitteral,
  RPLitteral,
];

let ConstraintLexer = new Lexer(allTokens, { ensureOptimizations: true });

class ConstraintParser extends EmbeddedActionsParser {
  constructor() {
    super(allTokens);
    const $ = this;
    $.mentee = {};
    $.mentor = {};

    $.RULE("ValueRule", () => {
      $.res1 = $.OR(
        $.a1 ||
          ($.a1 = [
            {
              ALT: () => {
                return $.mentee[$.CONSUME(MenteeVar).image];
              },
            },
            {
              ALT: () => {
                return $.mentor[$.CONSUME(MentorVar).image];
              },
            },
            {
              ALT: () => {
                return Number($.CONSUME(NumberLiteral).image);
              },
            },
            {
              ALT: () => {
                return $.CONSUME(StringLiteral).preparedImage;
              },
            },
          ])
      );
      return $.res1;
    });

    $.RULE("PlusRule", () => {
      let res = $.SUBRULE($.ValueRule);
      $.CONSUME(Plus);
      res += $.SUBRULE2($.ValueRule);
      return res;
    });

    $.RULE("MinusRule", () => {
      let res = $.SUBRULE($.ValueRule);
      $.CONSUME(Minus);
      res -= $.SUBRULE2($.ValueRule);
      return res;
    });

    $.RULE("TimesRule", () => {
      let res = $.SUBRULE($.ValueRule);
      $.CONSUME(Times);
      res *= $.SUBRULE2($.ValueRule);
      return res;
    });

    $.RULE("DividedRule", () => {
      let res = $.SUBRULE($.ValueRule);
      $.CONSUME(Divided);
      res /= $.SUBRULE2($.ValueRule);
      return res;
    });

    $.RULE("CalculusRule", () => {
      return $.OR(
        $.a2 ||
          ($.a2 = [
            {
              ALT: () => {
                return $.SUBRULE($.PlusRule);
              },
            },
            {
              ALT: () => {
                return $.SUBRULE($.MinusRule);
              },
            },
            {
              ALT: () => {
                return $.SUBRULE($.TimesRule);
              },
            },
            {
              ALT: () => {
                return $.SUBRULE($.DividedRule);
              },
            },
            {
              ALT: () => {
                return $.SUBRULE($.ValueRule);
              },
            },
          ])
      );
    });

    $.RULE("ExpressionRule", () => {
      let res1 = $.SUBRULE($.CalculusRule);
      return $.OR([
        {
          ALT: () => {
            $.CONSUME(InfEquals);
            return res1 <= $.SUBRULE2($.CalculusRule);
          },
        },
        {
          ALT: () => {
            $.CONSUME(InfStrict);
            return res1 < $.SUBRULE3($.CalculusRule);
          },
        },
        {
          ALT: () => {
            $.CONSUME(SupEquals);
            return res1 >= $.SUBRULE4($.CalculusRule);
          },
        },
        {
          ALT: () => {
            $.CONSUME(SupStrict);
            return res1 > $.SUBRULE5($.CalculusRule);
          },
        },
        {
          ALT: () => {
            $.CONSUME(Equals);
            return res1 == $.SUBRULE6($.CalculusRule);
          },
        },
        {
          ALT: () => {
            $.CONSUME(Not);
            return res1 != $.SUBRULE7($.CalculusRule);
          },
        },
      ]);
    });

    $.RULE("LogicalRule", () => {
      var res;
      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              let res2;
              res2 = $.SUBRULE($.ExpressionRule);
              res = res2;
            },
          },
          {
            ALT: () => {
              let res2;
              res2 = $.SUBRULE1($.SubLogicalRule);
              res = res2;
            },
          },
        ]);
      });

      $.MANY1(() => {
        $.OR1([
          {
            ALT: () => {
              $.CONSUME(And);
              $.MANY2(() => {
                $.OR2([
                  {
                    ALT: () => {
                      let res2;
                      res2 = $.SUBRULE2($.ExpressionRule);
                      res = res && res2;
                    },
                  },
                  {
                    ALT: () => {
                      let res2;
                      res2 = $.SUBRULE3($.SubLogicalRule);
                      res = res && res2;
                    },
                  },
                ]);
              });
            },
          },
          {
            ALT: () => {
              $.CONSUME1(Or);
              $.MANY3(() => {
                $.OR3([
                  {
                    ALT: () => {
                      let res2;
                      res2 = $.SUBRULE4($.ExpressionRule);
                      res = res || res2;
                    },
                  },
                  {
                    ALT: () => {
                      let res2;
                      res2 = $.SUBRULE5($.SubLogicalRule);
                      res = res || res2;
                    },
                  },
                ]);
              });
            },
          },
        ]);
      });
      return res;
    });

    $.RULE("SubLogicalRule", () => {
      $.CONSUME(LPLitteral);
      let res = $.SUBRULE($.LogicalRule);
      $.CONSUME1(RPLitteral);
      return res;
    });

    $.RULE("TopRule", () => {
      return $.SUBRULE($.LogicalRule);
    });

    this.performSelfAnalysis();
  }

  set(tokens, mentee, mentor) {
    this.input = tokens;
    this.mentee = mentee;
    this.mentor = mentor;
  }

  getResult() {
    return this.TopRule();
  }
}

module.exports = { ConstraintLexer, ConstraintParser };
