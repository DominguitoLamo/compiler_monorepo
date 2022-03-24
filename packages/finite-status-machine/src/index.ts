import { evaluate } from './lib/SimpleParser';

export * from './lib/SimpleCalculator';
export * from './lib/simpleLexer';

evaluate('int a = 1 + 12;');
const result = evaluate('1 + a;');
console.log(result);