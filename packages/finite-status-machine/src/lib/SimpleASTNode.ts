import { AstNodeType } from "../enum/AstNodeType";

export class SimpleASTNode {

  private children: Array<SimpleASTNode>;

  text: string;

  nodeType: AstNodeType;

  constructor(type: AstNodeType, text: string) {
    this.text = text;
    this.nodeType = type;
    this.children = [];
  }

  getChildren() {
    const arr: ReadonlyArray<SimpleASTNode> = this.children.slice();
    return arr;
  }

  addChildren(node: SimpleASTNode) {
    if (!node) {
      throw new Error('no node.');
    }
    this.children.push(node);
  }

}

export function dumpAST(node: SimpleASTNode, indent: string) {
  console.log(`${indent}${node.nodeType} ${node.text}`)
  node.getChildren()
    .forEach(item => {
      dumpAST(item, indent);
    });
}