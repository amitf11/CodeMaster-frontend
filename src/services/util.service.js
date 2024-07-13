export const utilService = {
    evaluateCode,
    capitalizeFirstLetter
}

function capitalizeFirstLetter(string) {
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function evaluateCode(studentCode, solutionCode, tests) {
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