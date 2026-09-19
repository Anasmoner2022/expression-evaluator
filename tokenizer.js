function tokenize(input) {
    if (typeof input !== 'string'){
        throw new Error ("Invalid input: must be a string")
    }
    let i = 0
    let tokens = []

    while (i < input.length){
        let ch = input[i]

        // Whitespace Handling
        if (ch === " " || ch === "\t" || ch === "\n"){
            i++
            continue
        }

        // Number Handling
        if ((ch >= '0' && ch <= '9') || (ch === '.')) {
            let start = i
            let dotCount = 0
            while (i < input.length && (input[i] >= '0' && input[i] <= '9') || input[i] === "."){
                if (input[i] === '.'){
                    dotCount++
                }
                i++
            }
            let numStr = input.substring(start, i)
            if (dotCount > 1){
                throw new Error(`Malformed number: multiple decimals in '${numStr}'`);
            }
            // .5
            if (numStr.startsWith('.')){
                throw new Error(`Malformed number: missing leading digit in '${numStr}'`);
            }
            if (numStr.endsWith(".")){
                throw new Error(`Malformed number: missing trailing digit in '${numStr}'`);
            }
            let value = Number(numStr)
            if (!Number.isFinite(value)){
                throw new Error(`Invalid number value: '${numStr}'`);
            }
                tokens.push({type: 'number', value: value})
            }
            // Operator handling
            else if (ch === '+' || ch === '-' || ch === '/' | ch === '*'){
            tokens.push({type: 'operator', value: ch})
            i++
            }
        
            // Parenthesis handling
            else if (ch === "(" || ch === ")"){
            tokens.push({type: 'parenthesis', value: ch})
            i++
            }

            // Unrecognized character
            else {
                throw new Error(`Invalid character at index ${i}: '${ch}'`);
            }
    }
    return tokens
}
// console.log(tokenize("1.23234523 * )4 - 12( / 21"))
module.exports = { tokenize };
