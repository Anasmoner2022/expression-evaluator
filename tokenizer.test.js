const assert = require('node:assert/strict');
const { tokenize } = require('./tokenizer');

assert.deepEqual(tokenize('3\t+\n4'), [
    { type: 'number', value: 3 },
    { type: 'operator', value: '+' },
    { type: 'number', value: 4 }
]);

assert.deepEqual(tokenize('3\r\n+4'), [
    { type: 'number', value: 3 },
    { type: 'operator', value: '+' },
    { type: 'number', value: 4 }
]);

assert.deepEqual(tokenize('3\u00a0+4'), [
    { type: 'number', value: 3 },
    { type: 'operator', value: '+' },
    { type: 'number', value: 4 }
]);

assert.deepEqual(tokenize('12 + 3.5 * (2 - 1)'), [
    { type: 'number', value: 12 },
    { type: 'operator', value: '+' },
    { type: 'number', value: 3.5 },
    { type: 'operator', value: '*' },
    { type: 'paren', value: '(' },
    { type: 'number', value: 2 },
    { type: 'operator', value: '-' },
    { type: 'number', value: 1 },
    { type: 'paren', value: ')' }
])
assert.throws(() => tokenize('1.2.3'), /Malformed number: multiple decimals/);
assert.throws(() => tokenize('12..5'), /Malformed number: multiple decimals/ )
assert.throws(() => tokenize('5.', /Malformed number: missing trailing digit/))
assert.throws(() => tokenize('.5'), /Malformed number: missing leading digit/)
assert.throws(() => tokenize('.'), /Malformed number: missing leading digit/)

assert.throws(() => tokenize(null), /Invalid input: must be a string/)
assert.throws(() => tokenize('12 $ 3', /Invalid character/))
console.log('Tokenizer checks passed');