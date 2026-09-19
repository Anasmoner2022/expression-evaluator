const assert = require('node:assert/strict');
const { evaluateRPN } = require('./evaluator');

const tNum = (val) => ({ type: 'number', value: val });
const tOp = (val) => ({ type: 'operator', value: val });
const tPar = (val) => ({ type: 'parenthesis', value: val });

// 1. Successful subtraction and division tests (order dependency)
assert.equal(evaluateRPN([tNum(9), tNum(4), tOp('-')]), 5); // 9 - 4
assert.equal(evaluateRPN([tNum(20), tNum(5), tOp('/'), tNum(2), tOp('/')]), 2); // (20 / 5) / 2

// 2. Direct malformed-RPN tests
// Too few operands
assert.throws(() => evaluateRPN([tNum(5), tOp('+')]), /Insufficient operands/);
// Too many final values
assert.throws(() => evaluateRPN([tNum(2), tNum(3)]), /Too many values left/);
// Empty input
assert.throws(() => evaluateRPN([]), /Empty expression/);
// Invalid token type (e.g., parenthesis leaking into Evaluator)
assert.throws(() => evaluateRPN([tNum(1), tPar('(')]), /Invalid token type/);
// Zero division
assert.throws(() => evaluateRPN([tNum(5), tNum(0), tOp('/')]), /Division by zero/);

// 3. Ensuring no input mutation
const inputRPN = [tNum(10), tNum(2), tOp('-')];
const inputCopy = [...inputRPN];
evaluateRPN(inputRPN);
assert.deepEqual(inputRPN, inputCopy); // Verifies the array remains completely untouched

// 4. Non-finite overflow test
assert.throws(() => evaluateRPN([tNum(Number.MAX_VALUE), tNum(2), tOp('*')]), /non-finite intermediate result/);

console.log('Evaluator tests passed');