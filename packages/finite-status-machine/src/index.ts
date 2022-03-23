import { evaluate } from './lib/SimpleCalculator_update';

export * from './lib/SimpleCalculator';
export * from './lib/simpleLexer';

const result = evaluate('5 + 5 + 14');
console.log(result);