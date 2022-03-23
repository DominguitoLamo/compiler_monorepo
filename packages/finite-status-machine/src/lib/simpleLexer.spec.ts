import { DfaState } from "../enum/DfaState";

import { tokenize } from "./simpleLexer";

describe('SimpleLexerTest', () => {
  it('parseEnd', () => {
    const script = 'int a = 32 + 32;';
    const tokens = tokenize(script);
    tokens.setPos(6);
    expect(tokens.peek()!.type).toEqual(DfaState.SemiColon);
  });

  it('parseExpression', () => {
    const sentence = '2 * 3 + 5';
    const tokens = tokenize(sentence);
    let token = tokens.read()
    expect(token!.type).toEqual(DfaState.IntLiteral);
    token = tokens.read()
    expect(token!.type).toEqual(DfaState.Star);
  })

  it('parseDim', () => {
    const sentence = 'int age = 45';
    const tokens = tokenize(sentence);
    let token = tokens.read()
    expect(token!.type).toEqual(DfaState.Int);
    token = tokens.read()
    expect(token!.type).toEqual(DfaState.Id);
  })
});
