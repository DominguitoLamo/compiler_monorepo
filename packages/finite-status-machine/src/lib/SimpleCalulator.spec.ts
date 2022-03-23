import { AstNodeType } from "../enum/AstNodeType";

import { token2AST } from "./SimpleCalculator";

describe('SimpleCalculator', () => {
  it('parseAdditive', () => {
    const script = 'int a = 32 + 32;';
    const node = token2AST(script);
    expect(node.nodeType).toEqual(AstNodeType.IntDeclaration);
    
    const child = node.getChildren()[0];
    expect(child.text).toEqual('+');
    expect(child.nodeType).toEqual(AstNodeType.Additive);
  })

  it('parenthesis error', () => {
    const script = 'int a = (32 + 32;';
    expect(token2AST(script)).toThrow();
    // expect(() => {throw new Error('new Error')}).toThrow();
  })
});