import { AstNodeType } from "../enum/AstNodeType";
import { DfaState } from "../enum/DfaState";
import { evaluteNodes } from "./evaluateParser_update";

import { SimpleASTNode } from "./SimpleASTNode";
import { SimpleTokenReader, tokenize } from "./simpleLexer";

export function token2AST(script: string) {
  const token = tokenize(script);
  const rootNode = prog(token);

  return rootNode;
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

function expressionStatement(tokenReader: SimpleTokenReader) {
  const pos = tokenReader.getPosition();
  let node = additive(tokenReader);

  if (node) {
    let token = tokenReader.peek();
    if (token && token.type == DfaState.SemiColon) {
      tokenReader.read();
    } else {
      node = null;
      tokenReader.setPos(pos);
    }
  } else {
    tokenReader.setPos(pos);
  }

  return node;
}

function assignmentStatment(tokenReader: SimpleTokenReader) {
  let node: SimpleASTNode  = null;
  let token = tokenReader.peek();

  if (token && token.type === DfaState.Id) {
    token = tokenReader.read();
    node = new SimpleASTNode(AstNodeType.AssignmentStmt, token.text);
    token = tokenReader.peek();

    if (token && token.type === DfaState.Assignment) {
      tokenReader.read();
      const child = additive(tokenReader);
      if (!child) {
        throw new Error('invalid assignment statement, expecting an expression');
      } else {
        node.addChildren(child);
        if (tokenReader.peek().type === DfaState.SemiColon) {
          tokenReader.read();
        } else {
          throw new Error('invalid statement, expecting semicolon');
        }
      }
    } else {
      throw new Error('invalid expression');
    }
  }

  return node;
}

function additive(tokenReader: SimpleTokenReader) {
  let child1 = multiplicative(tokenReader);
  let node = child1;

  if (child1) {
    while (true) {
      let token = tokenReader.peek();
  
      if (token && (token.type === DfaState.Plus || token.type === DfaState.Minus)) {
        token = tokenReader.read();
        const child2 = multiplicative(tokenReader);
  
        if (child2) {
          node = new SimpleASTNode(AstNodeType.Additive, token.text);
          node.addChildren(child1);
          node.addChildren(child2);
          child1 = node;
        } else {
          throw new Error('Invalid Expression. Expecting another Intliteral');
        }
      } else {
        break;
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

function prog(tokens: SimpleTokenReader) {
  const node = new SimpleASTNode(AstNodeType.Program, "pwc");
  
  while (tokens.peek()) {
    let child = intDeclare(tokens);

    if (!child) {
      child = expressionStatement(tokens);
    }

    if (!child) {
      child = assignmentStatment(tokens);
    }

    if (child) {
      node.addChildren(child)
    } else {
      throw new Error('unknown statement');
    }
  }

  return node;
}

export function evaluate(script: string): number {
  const tokens = tokenize(script);
  const node = prog(tokens);

  const result = evaluteNodes(node)
  return result;
}