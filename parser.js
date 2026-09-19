const PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2 };
function toRPN(tokens) {
  const output = []
  const opStack = []

  // true = expecting number or (, false = expecting operator or )
  let nextNumOrOpen = true 
  for (const token of tokens) {
    if (token.type === 'number') {
      // to check if the expecting next token is number or not
      if (!nextNumOrOpen){
        throw new Error(`Unexpected number '${token.value}'. Expected operator.`)
      }
      output.push(token)
      nextNumOrOpen = false // after a number we expected operator or )
    }

    else if (token.type === 'operator'){
      // to check if next token is operator or not
      if (nextNumOrOpen){
        throw new Error(`Unexpected operator '${token.value}'.`)
      }

      // look to top of stack, if precedence of top more than or equal the currant one 
      // pop the top then push it to output then push the currant to stack.
      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1].type === 'operator' &&
        PRECEDENCE[opStack[opStack.length - 1].value] >= PRECEDENCE[token.value] 
      ) {
        output.push(opStack.pop())
      }

      opStack.push(token)
      nextNumOrOpen = true // after an operator we expected number or (
    }

    else if (token.type === 'parenthesis' && token.value === '('){
      // the flag must be true in case we have an open parenthesis
      if (!nextNumOrOpen) {
        throw new Error(`Unexpected opening parenthesis. Missing operator?`)
      }
      opStack.push(token)
      nextNumOrOpen = true // after open pranthesis we expect number or ( 
    }

    else if (token.type === 'parenthesis' && token.value === ')'){
      // the flag must be false in case we have an close parenthesis
      if (nextNumOrOpen) {
        throw new Error(`Unexpected closing parenthesis. Empty group or missing operand?`)
      }
      let matched = false
      // pop untill we find an open parenthesis
      while (opStack.length > 0 ){
        const top = opStack.pop()
        
        if (top.type === 'parenthesis' && top.value === '('){
          matched = true
          break
        }
        output.push(top)
      }
      // if matched deosnt change that mean the ')' deosnt have an open one so ')' extra
      if (!matched) {
        throw new Error(`Mismatched parentheses: extra ')'`)
      }

      nextNumOrOpen = false // expected after close pranthesis we expect operator
    }
  }

  // must be false at the end because the expression must end with number or open parentheses.
  if (nextNumOrOpen) {
    throw new Error("Expression ended unexpectedly")
  }

  // Drain all operators in stack if tokens finished
  while (opStack.length > 0 ) {
    const top = opStack.pop()
    // if we have parentheses , it will be an open one so '(' extra.
    if (top.type === 'parenthesis') {
      throw new Error ("Mismatched parentheses: extra '('")
    }
    output.push(top)  
  }

  return output
}

module.exports = { toRPN, PRECEDENCE };