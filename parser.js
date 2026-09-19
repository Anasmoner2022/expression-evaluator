const PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2 };

function toRPN(tokens) {
    const output = [];
    const opStack = [];

    // true = expecting number or (, false = expecting operator or )
    let nextOperand = true; 
  
    for (const token of tokens) {
        if (token.type === 'number') {
            if (!nextOperand){
                throw new Error(`Unexpected number '${token.value}'. Expected operator.`);
            }
            output.push(token);
            nextOperand = false; 
        }

        else if (token.type === 'operator') {
            if (nextOperand){
                throw new Error(`Unexpected operator '${token.value}'.`);
            }

            while (
                opStack.length > 0 &&
                opStack[opStack.length - 1].type === 'operator' &&
                PRECEDENCE[opStack[opStack.length - 1].value] >= PRECEDENCE[token.value] 
            ) {
                output.push(opStack.pop());
            }

            opStack.push(token);
            nextOperand = true; 
        }

        // Updated contract to 'paren'
        else if (token.type === 'paren' && token.value === '(') {
            if (!nextOperand) {
                throw new Error(`Unexpected opening parenthesis. Missing operator?`);
            }
            opStack.push(token);
            nextOperand = true; 
        }

        // Updated contract to 'paren'
        else if (token.type === 'paren' && token.value === ')') {
            if (nextOperand) {
                throw new Error(`Unexpected closing parenthesis. Empty group or missing operand?`);
            }
      
            let matched = false;
            while (opStack.length > 0) {
                const top = opStack.pop();
                
                if (top.type === 'paren' && top.value === '(') {
                    matched = true;
                    break;
                }
                output.push(top);
            }

            if (!matched) {
                throw new Error(`Mismatched parentheses: extra ')'`);
            }

            nextOperand = false; 
        }
        
        else {
            throw new Error(`Invalid or unrecognized token type in parser: '${token.type}'`);
        }
    }

    if (nextOperand) {
        throw new Error("Expression ended unexpectedly. Missing right operand.");
    }

    while (opStack.length > 0) {
        const top = opStack.pop();
        if (top.type === 'paren') {
            throw new Error("Mismatched parentheses: extra '('");
        }
        output.push(top);  
    }

    return output;
}

module.exports = { toRPN, PRECEDENCE };