export enum AstNodeType {
  Program = 'Program',
  
  IntDeclaration = 'IntDeclaration',
  ExpressionStmt = 'ExpressionStmt',
  AssignmentStmt = 'AssignmentStmt',

  Primary = 'Primary',
  Multiplicative = 'Multiplicative',
  Additive = 'Additive',

  Identifier = 'Identifier',
  IntLiteral = 'IntLiteral'
}