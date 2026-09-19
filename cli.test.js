const { execSync } = require('node:child_process');
const assert = require('node:assert/strict');

// Helper to run the CLI and capture stdout, stderr, and exit status
function runCLI(args) {
    try {
        // stdio: 'pipe' ensures we capture output instead of it printing to the console
        const stdout = execSync(`node index.js ${args}`, { encoding: 'utf8', stdio: 'pipe' });
        return { stdout: stdout.trim(), stderr: '', status: 0 };
    } catch (error) {
        return { 
            stdout: error.stdout ? error.stdout.toString().trim() : '', 
            stderr: error.stderr ? error.stderr.toString().trim() : '', 
            status: error.status 
        };
    }
}

// 1. Valid expression: stdout result only, exit 0
const validTest = runCLI('"3 + 4 * 2"');
assert.equal(validTest.status, 0);
assert.equal(validTest.stdout, '11');
assert.equal(validTest.stderr, '');

// 2. Missing arguments: exit 1, stderr contains Error, stdout empty
const missingArgTest = runCLI('');
assert.equal(missingArgTest.status, 1);
assert.equal(missingArgTest.stdout, '');
assert.match(missingArgTest.stderr, /Error:/);

// 3. Multiple arguments: exit 1, stderr contains Error, stdout empty
const multipleArgTest = runCLI('"3 + 3" "4 + 4"');
assert.equal(multipleArgTest.status, 1);
assert.equal(multipleArgTest.stdout, '');
assert.match(multipleArgTest.stderr, /Error:/);

// 4. Invalid expression (Pipeline test: division by zero): exit 1, stderr Error
const divZeroTest = runCLI('"1 / (2 - 2)"');
assert.equal(divZeroTest.status, 1);
assert.equal(divZeroTest.stdout, '');
assert.match(divZeroTest.stderr, /Division by zero/);

// 5. Tolerance check: 0.1 + 0.2 (Testing floating-point arithmetic)
const floatTest = runCLI('"0.1 + 0.2"');
assert.equal(floatTest.status, 0);
const floatResult = Number(floatTest.stdout);
assert.ok(
    Math.abs(floatResult - 0.3) < 1e-12, 
    `Floating point tolerance exceeded. Got: ${floatResult}, Expected approx: 0.3`
);

console.log('CLI and end-to-end integration checks passed');