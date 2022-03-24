import { evaluate } from './SimpleParser';

describe('Assignment Test', () => {
  it('directAssignment', () => {
    const script1 = 'int a = 2 + 1;'
    evaluate(script1);
    const script2 = 'a + 12;';
    expect(evaluate(script2)).toEqual(15);
  })

  it('indirectAssignment', () => {
    const script1 = 'int a;'
    evaluate(script1);
    const script2 = 'a = 1 + 12;';
    evaluate(script2)
    const script3 = 'a + 4;';
    expect(evaluate(script3)).toEqual(17);
  })
})