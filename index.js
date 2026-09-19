const { tokenize } = require('./tokenizer');
const { toRPN } = require('./parser');
const { evaluateRPN } = require('./evaluator');

function run(input) {
    return evaluateRPN(toRPN(tokenize(input)));
}

if (require.main === module) {
    try {
        const args = process.argv.slice(2);
        if (args.length !== 1) {
            throw new Error('Usage: node index.js "expression"');
        }
        console.log(run(args[0]));
    } catch (err) {
        console.error('Error: ' + err.message);
        process.exitCode = 1;
    }
}

module.exports = { run };