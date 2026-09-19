const { spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');

// Helper to run the CLI and capture stdout, stderr, and exit status
function runCLI(args) {
    const result = spawnSync(process.execPath, ['index.js', ...args], {
        encoding: 'utf8', cwd: __dirname
    });
    if (result.error) throw result.error;
    return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

// 1. Valid expression: stdout result only, exit 0
const validTest = runCLI(['3 + 4 * 2']);
assert.equal(validTest.status, 0);
assert.equal(validTest.stdout, '11');
assert.equal(validTest.stderr, '');

// 2. Missing arguments: exit 1, stderr contains Error, stdout empty
const missingArgTest = runCLI([]);
assert.equal(missingArgTest.status, 1);
assert.equal(missingArgTest.stdout, '');
assert.match(missingArgTest.stderr, /Error:/);

// 3. Multiple arguments: exit 1, stderr contains Error, stdout empty
const multipleArgTest = runCLI(['3 + 3', '4 + 4']);
assert.equal(multipleArgTest.status, 1);
assert.equal(multipleArgTest.stdout, '');
assert.match(multipleArgTest.stderr, /Error:/);

// 4. Invalid expression (Pipeline test: division by zero): exit 1, stderr Error
const divZeroTest = runCLI(['1 / (2 - 2)']);
assert.equal(divZeroTest.status, 1);
assert.equal(divZeroTest.stdout, '');
assert.match(divZeroTest.stderr, /Division by zero/);

// 5. Tolerance check: 0.1 + 0.2 (Testing floating-point arithmetic)
const floatTest = runCLI(['0.1 + 0.2']);
assert.equal(floatTest.status, 0);
const floatResult = Number(floatTest.stdout);
assert.ok(
    Math.abs(floatResult - 0.3) < 1e-12, 
    `Floating point tolerance exceeded. Got: ${floatResult}, Expected approx: 0.3`
);

const subtraction = runCLI(['10 - 3']);
assert.deepEqual(subtraction, { stdout: '7', stderr: '', status: 0 });
const emptyExpression = runCLI(['']);
assert.equal(emptyExpression.status, 1);
assert.equal(emptyExpression.stdout, '');
assert.match(emptyExpression.stderr, /Error:/);
console.log('CLI and end-to-end integration checks passed');