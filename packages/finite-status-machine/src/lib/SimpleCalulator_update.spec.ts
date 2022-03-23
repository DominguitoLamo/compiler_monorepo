import { AstNodeType } from "../enum/AstNodeType";

import { evaluate, token2AST } from "./SimpleCalculator_update";

describe('Convert to AST', () => {
  it('parseAdditive', () => {
    const script = 'int a = 32 + 32;';
    const node = token2AST(script);
    expect(node.nodeType).toEqual(AstNodeType.IntDeclaration);
    
    const child = node.getChildren()[0];
    expect(child.text).toEqual('+');
    expect(child.nodeType).toEqual(AstNodeType.Additive);
  })
});

describe('Evaluting', () => {
  it('multiple add', () => {
    expect(evaluate('5 + 5 + 9')).toEqual(19);
  })

  it('parenthesis operation with multiple', () => {
    expect(evaluate('(10 - 5) * 9')).toEqual(45);
  })

  it('parenthesis operation with multiple', () => {
    expect(evaluate('(50 - 5) / 9')).toEqual(5);
  })
})