function evaluateRPN(rpn) {
  const valueStack = []

  for (const token of rpn) {
    if (token.type === 'number') {
      if (!Number.isFinite(token.value)){
        throw new Error(`Invalid numeric value: ${token.value}`)
      }
      valueStack.push(token.value)
    }

    else if (token.type === 'operator'){

      if (valueStack.length < 2) {
        throw new Error("Insufficient operands for operator.")
      }
      
      const right = valueStack.pop()
      const left  = valueStack.pop()
      let result
      switch (token.value) {
        case '+':
          result = left + right
          break;
        case '-':
            result = left - right
            break
        case '*':
              result = left * right
              break
        case '/':
            if (right === 0){
              throw new Error("Division by zero.");
            }
            result = left / right
            break
        default:
            throw new Error(`Unsupported operator: ${token.value}`)
          }
          
          if (!Number.isFinite(result)){
            throw new Error("Mathematical error: non-finite intermediate result.")
          }
          valueStack.push(result)
        }

        else {
          throw new Error(`Invalid token type in RPN stream: ${token.type}`);
        }
  }
  if (valueStack.length === 0) {
        throw new Error("Empty expression. No result computed.");
  }
    
  if (valueStack.length > 1) {
        throw new Error("Incomplete evaluation. Too many values left on the stack.");
  }

  return valueStack[0];
}


module.exports = { evaluateRPN };