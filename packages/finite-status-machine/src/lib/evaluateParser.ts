import { AstNodeType } from "../enum/AstNodeType";
import { SimpleASTNode } from "./SimpleASTNode";

type OperType = AstNodeType.Program | AstNodeType.Additive | AstNodeType.Multiplicative | AstNodeType.IntLiteral;

const operatorFunc: Record<OperType, (nodes: SimpleASTNode, result?: number, indent?: string) => number> = {
  [AstNodeType.Program]: evaluteProgram,
  [AstNodeType.Additive]: evaluateAdditive,
  [AstNodeType.Multiplicative]: evaluateMultiplicative,
  [AstNodeType.IntLiteral]: evaluateInt
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

