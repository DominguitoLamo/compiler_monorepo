import { AstNodeType } from "../enum/AstNodeType";
import { SimpleASTNode } from "./SimpleASTNode";

type OperType = AstNodeType.Program |
 AstNodeType.Additive |
 AstNodeType.Multiplicative |
 AstNodeType.IntLiteral |
 AstNodeType.Identifier |
 AstNodeType.IntDeclaration |
 AstNodeType.AssignmentStmt;

const variables = new Map<string, number>();

const operatorFunc: Record<OperType, (nodes: SimpleASTNode, result?: number, indent?: string) => number> = {
  [AstNodeType.Program]: evaluteProgram,
  [AstNodeType.Additive]: evaluateAdditive,
  [AstNodeType.Multiplicative]: evaluateMultiplicative,
  [AstNodeType.IntLiteral]: evaluateInt,
  [AstNodeType.Identifier]: evaluateId,
  [AstNodeType.IntDeclaration]: evaluateIntDeclaration,
  [AstNodeType.AssignmentStmt]: evaluateAssignment
};

function evaluteProgram(nodes: SimpleASTNode, result: number, indent: string) {
  const child = nodes.getChildren()
  child.forEach(item => {
    result = evaluateParser(item, item.nodeType, result, `\t${indent}`);
  })

  return result;
}

function evaluateAdditive(nodes: SimpleASTNode, result: number, indent: string) {
  const child1 = nodes.getChildren()[0];
  const child2 = nodes.getChildren()[1];

  const result1 = evaluateParser(child1, child1.nodeType);
  const result2 = evaluateParser(child2, child2.nodeType);

  let finalResult = 0;
  if (nodes.text === '+') {
    finalResult = result1 + result2;
  } else {
    finalResult = result1 - result2;
  }

  return result + finalResult;
}

function evaluateInt(nodes: SimpleASTNode) {
  return Number(nodes.text);
}

function evaluateId(nodes: SimpleASTNode) {
  const variable = nodes.text;
  if (variables.has(variable)) {
    const value = variables.get(variable);
    if (value) {
      return value;
    } else {
      throw new Error(`variable ${variable} doesn't have any value.`)
    }
  } else {
    throw new Error('unknown variable: ' + variable);
  }
}

function evaluateIntDeclaration(nodes: SimpleASTNode) {
  const variable = nodes.text;
  let value: number = null;
  const child = nodes.getChildren().length > 0 ? nodes.getChildren()[0] : null;

  if (child) {
    value = evaluateParser(child, child.nodeType);
  }

  variables.set(variable, value);
  return 1;
}

function evaluateAssignment(nodes: SimpleASTNode) {
  if (!variables.has(nodes.text)) {
    throw new Error(`the variable ${nodes.text} doesn't exist`);
  }

  return evaluateIntDeclaration(nodes);
}

function evaluateMultiplicative(nodes: SimpleASTNode, result: number, indent: string) {
  const child1 = nodes.getChildren()[0];
  const child2 = nodes.getChildren()[1];

  const result1 = evaluateParser(child1, child1.nodeType);
  const result2 = evaluateParser(child2, child2.nodeType);

  let finalResult = 0;
  if (nodes.text === '*') {
    finalResult = result1 * result2;
  } else {
    finalResult = result1 / result2;
  }

  return result + finalResult;
}

function evaluateParser(nodes: SimpleASTNode, operType: AstNodeType = AstNodeType.Program, result: number = 0, intent: string = "\t") {
  return operatorFunc[operType](nodes, result, intent);
}

export function evaluteNodes(nodes: SimpleASTNode) {
  return evaluateParser(nodes);
}

