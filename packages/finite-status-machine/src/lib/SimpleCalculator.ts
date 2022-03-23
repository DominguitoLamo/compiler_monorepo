import { AstNodeType } from "../enum/AstNodeType";
import { DfaState } from "../enum/DfaState";

import { SimpleASTNode } from "./SimpleASTNode";
import { SimpleTokenReader, tokenize } from "./simpleLexer";

export function token2AST(script: string) {
  const token = tokenize(script);
  return intDeclare(token);
}

export function intDeclare(tokenReader: SimpleTokenReader) {
  let node: SimpleASTNode = null;
  let token = tokenReader.peek();

  if (token && token.type === DfaState.Int) {
    token = tokenReader.read();
    if (tokenReader.peek().type === DfaState.Id) {
      token = tokenReader.read();
      node = new SimpleASTNode(AstNodeType.IntDeclaration, token.text);
      token = tokenReader.peek()
      if (token && token.type === DfaState.Assignment) {
        tokenReader.read()
        const child = additive(tokenReader);

        if (!child) {
          throw new Error('invalid variable initialization, expecting an expression.');
        } else {
          node.addChildren(child);
        }
      }
    } else {
      throw new Error('variable name expected');
    }
  }

  if (node) {
    token = tokenReader.peek();
    if (token && token.type === DfaState.SemiColon) {
      tokenReader.read()
    } else {
      throw new Error("invalid statement, expecting semicolon");
    }
  }

  return node;
}

function additive(tokenReader: SimpleTokenReader) {
  const child1 = multiplicative(tokenReader);
  let node = child1;

  let token = tokenReader.peek();
  if (child1 && token) {
    if (token.type === DfaState.Plus || token.type === DfaState.Minus) {
      token = tokenReader.read();
      const child2 = multiplicative(tokenReader);
      if (child2) {
        node = new SimpleASTNode(AstNodeType.Additive, token.text);
        node.addChildren(child1);
        node.addChildren(child2);
      }
    }
  }

  return node;
}

function multiplicative(tokenReader: SimpleTokenReader) {
  const child1 = primary(tokenReader);
  let node = child1;

  let token = tokenReader.peek();
  if (child1 && token) {
    if (token.type === DfaState.Star || token.type === DfaState.Slash) {
      token = tokenReader.read();
      const child2 = multiplicative(tokenReader);
      if (child2) {
        node = new SimpleASTNode(AstNodeType.Multiplicative, token.text);
        node.addChildren(child1);
        node.addChildren(child2);
      } else {
        throw new Error('invalid multiplicative expression, expecting the right part.')
      }
    }
  }

  return node;
}

function primary(tokenReader: SimpleTokenReader) {
  let node = null;
  let token = tokenReader.peek()
  if (token) {
    if (token.type === DfaState.IntLiteral) {
      token = tokenReader.read()
      node = new SimpleASTNode(AstNodeType.IntLiteral, token.text);
    } else if (token.type === DfaState.Id) {
      token = tokenReader.read();
      node = new SimpleASTNode(AstNodeType.Identifier, token.text);
    } else if (token.type === DfaState.LeftParen) {
      tokenReader.read();
      node = additive(tokenReader);
      if (node) {
        token = tokenReader.peek()
        if (token && token.type === DfaState.RightParen) {
          token = tokenReader.read()
        } else {
          throw new Error('invalid expression. Expecting the right parenthesis');
        }
      } else {
        throw new Error('expecting an additive expression inside parenthesis');
      }
    }
  }

  return node;
}

export function dumpAST(node: SimpleASTNode, indent: string) {
  console.log(`${indent}${node.nodeType} ${node.text}`);
  node.getChildren().forEach(item => {
    dumpAST(item, ` ${indent}`);
  })
}