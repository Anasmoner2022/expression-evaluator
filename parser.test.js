const assert = require('node:assert/strict');
const { toRPN } = require('./parser');

// Helper to quickly generate mock tokens
const tNum = (val) => ({ type: 'number', value: val });
const tOp = (val) => ({ type: 'operator', value: val });
const tPar = (val) => ({ type: 'parenthesis', value: val });

// 1. Nested groups & normal evaluation: 8 / (4 - 2) + 3
const nestedInput = [tNum(8), tOp('/'), tPar('('), tNum(4), tOp('-'), tNum(2), tPar(')'), tOp('+'), tNum(3)];
assert.deepEqual(toRPN(nestedInput), [
    tNum(8), tNum(4), tNum(2), tOp('-'), tOp('/'), tNum(3), tOp('+')
]);

// 2. Equal precedence: 10 - 3 - 2
const equalPrecInput = [tNum(10), tOp('-'), tNum(3), tOp('-'), tNum(2)];
assert.deepEqual(toRPN(equalPrecInput), [
    tNum(10), tNum(3), tOp('-'), tNum(2), tOp('-')
]);

// 3. Grammar Rejections
assert.throws(() => toRPN([tPar('('), tPar(')')]), /Unexpected closing parenthesis/); // ()
assert.throws(() => toRPN([tNum(1), tNum(2)]), /Unexpected number/);                 // 1 2
assert.throws(() => toRPN([tNum(2), tPar('('), tNum(3), tPar(')')]), /Unexpected opening parenthesis/); // 2(3)
assert.throws(() => toRPN([tPar('('), tNum(2), tPar(')'), tNum(3)]), /Unexpected number/); // (2)3
assert.throws(() => toRPN([tNum(3), tOp('+')]), /Expression ended unexpectedly/);    // 3+
assert.throws(() => toRPN([tOp('*'), tNum(3)]), /Unexpected operator/);              // *3

// 4. Mismatched Parentheses
assert.throws(() => toRPN([tPar('('), tNum(1)]), /extra '\('/);                      // (1
assert.throws(() => toRPN([tNum(1), tPar(')')]), /extra '\)'/);                      // 1)

// 5. Verifying original tokens are unchanged (strict equality on object references)
const tokenRef = tNum(42);
const parsedOutput = toRPN([tokenRef]);
assert.equal(parsedOutput[0], tokenRef); 

console.log('Parser grammar and output checks passed');