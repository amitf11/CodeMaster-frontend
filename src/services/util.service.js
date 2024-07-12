export const utilService = {
    removeComments,
    evaluateCode
}

function removeComments(code) {
    // Remove multi-line comments
    let noMultilineComments = code.replace(/\/\*[\s\S]*?\*\//g, '')

    // Remove single-line comments
    let noComments = noMultilineComments.replace(/\/\/.*/g, '')

    return noComments.trim()
}

function evaluateCode (studentCode, solutionCode, tests) {
    const testCases = tests

    try {
        const studentFunction = new Function('return ' + studentCode)()
        const solutionFunction = new Function('return ' + solutionCode)()

        for (const testCase of testCases) {
            const studentResult = studentFunction(...testCase.input)
            const solutionResult = solutionFunction(...testCase.input)

            if (studentResult !== solutionResult) {
                return false
            }
        }
        return true
    } catch (error) {
        console.error('Error evaluating code:', error)
        return false
    }
}