import { AstNodeType } from "./enum/AstNodeType";
import { dumpAST, token2AST } from "./lib/SimpleCalculator";

const script = 'int a = 32 + 32;';
const node = token2AST(script);
console.log(node.nodeType === AstNodeType.IntDeclaration);
dumpAST(node, " ");

