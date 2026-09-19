
# Expression Evaluator

A robust, pipeline-based mathematical expression evaluator built in JavaScript. It parses standard infix mathematical string expressions and accurately calculates the result using the Shunting Yard algorithm and a Reverse Polish Notation (RPN) evaluator.

## Run and test

**Runtime Requirements:** Node.js v18.0.0 or higher.

**To run the CLI application:**
Pass the mathematical expression as a single string argument.
```bash
node index.js "3 + (4 * 2 / 3) + 2"

```

**To run the verification tests:**
Tests are strictly separated by pipeline layer. They assert exact object structures, error states, and exit codes.

```bash
node tokenizer.test.js
node parser.test.js
node evaluator.test.js
node cli.test.js

```

## Supported language

**Supported Syntax:**

* **Numbers:** Integers (`42`) and finite decimals (`3.14`).
* **Operators:** Addition (`+`), Subtraction (`-`), Multiplication (`*`), Division (`/`).
* **Grouping:** Parentheses `()` for precedence override.
* **Whitespace:** Spaces, tabs, and newlines are safely ignored between tokens.

**Decimal Policy:**
Decimals are strictly validated. A number must have at least one digit before and after the decimal point. Expressions like `1.2.3`, `.5`, and `5.` will be rejected as structural syntax errors.

**Exclusions:**

* Implicit multiplication is not supported (e.g., `2(3)` throws a grammar error; write `2 * (3)`).
* Unary operators are not supported (e.g., `-5 + 3` will fail; express as `0 - 5 + 3`).

## Design

The application uses a functional, three-stage pipeline. Each stage strictly owns a specific class of errors, preventing downstream logic from compensating for upstream failures.

1. **Tokenizer (Lexical Analysis):**
Converts a raw string into an array of typed Token objects (`{ type, value }`).
*Error ownership:* Unrecognized characters, malformed numbers, non-string inputs.
2. **Parser (Syntactic Analysis):**
Consumes infix tokens and reorders them into Postfix (RPN) notation using Dijkstra's Shunting Yard algorithm. Checks grammar state machines to ensure tokens alternate legally.
*Error ownership:* Mismatched parentheses, unexpected tokens (e.g., `3 4 +`), dangling operators.
3. **Evaluator (Semantic Execution):**
Iterates through RPN tokens, maintaining a strictly numeric value stack to compute the final answer.
*Error ownership:* Division by zero, non-finite bounds (e.g., `Infinity`), insufficient operands.

## Verification

Testing relies on Node's native `node:assert/strict` library. The test suites check exact data transformations and enforce strict zero-mutation invariants on inputs between stages.

**Regression Story: The Switch Fall-Through**
During Milestone 3, a defect was identified in the Evaluator where subtraction, multiplication, and division mysteriously crashed with `"Unsupported operator"`. The parser successfully converted `2 - 3` to `[2, 3, -]`, but the evaluator crashed.

*The cause:* The `switch(token.value)` lacked `break;` statements. The `-` operator executed correctly, but immediately fell through to `*`, `/`, and finally the `default` error state.
*The fix:* Explicit `break;` boundaries were added. A regression test `node index.js "10 - 3"` was added to `cli.test.js` to mathematically prove `-` resolves and exits cleanly without evaluating downstream cases.

## Limitations

* **Floating-Point Arithmetic:** Because JavaScript utilizes IEEE 754 double-precision 64-bit floats, base-10 fractional math is subject to minor precision loss (e.g., `0.1 + 0.2` evaluates to `0.30000000000000004`). The evaluator allows this normal JS behavior. Our test suite handles this by verifying results fall within an absolute tolerance (`< 1e-12`), rather than asserting strict equality.
* **Hardware Overflows:** Multiplying two massive numbers (e.g., `Number.MAX_VALUE * 2`) exceeds memory ceilings. The evaluator rejects the resulting `Infinity` with a non-finite arithmetic error.
* **Future Work:** Adding support for negative numbers (unary minus), exponents (`^`), and trigonometric functions (`sin`, `cos`) would require modifying both the Tokenizer (to identify unary minus vs subtraction) and the Parser (to handle right-associative operations like exponents).

```

---

### Review Submission Notes for the Evaluator 

**One Trace (Novel Expression):** `(2 + 4) * 3`
1. *Tokenizer:* `[ {type:'parenthesis', value:'('}, {type:'number', value:2}, {type:'operator', value:'+'}, {type:'number', value:4}, {type:'parenthesis', value:')'}, {type:'operator', value:'*'}, {type:'number', value:3} ]`
2. *Parser:* Yields RPN `[ 2, 4, +, 3, * ]`. (The `+` gets pushed out by the `)` barrier release).
3. *Evaluator:* Pushes 2, pushes 4. Sees `+`, pops 4, pops 2, pushes 6. Pushes 3. Sees `*`, pops 3, pops 6, pushes 18. Output: `18`.

**Rejecting a novel invalid expression independently:** `2 + / 3`
1. *Tokenizer:* Converts happily to `[2, +, /, 3]`. No errors.
2. *Parser:* Sees `2` (expects operator). Sees `+` (expects number). Sees `/`. *CRASH*. The grammar state expected a number or `(`, but got an operator. It throws `Unexpected operator '/'` immediately, preventing the garbage tokens from ever reaching the Evaluator.

**One Tradeoff:** 
Forcing explicit decimals (rejecting `.5` and `5.`). We traded slightly higher user friction for extreme parser safety. By strictly requiring digits on both sides of a decimal, the tokenizer's inner loops are heavily simplified and we eliminate edge cases where consecutive periods (`..`) or trailing operator collisions could accidentally slip past string-to-number casting.

```