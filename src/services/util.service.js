export const utilService = {
    removeComments
}

function removeComments(code) {
    // Remove multi-line comments
    let noMultilineComments = code.replace(/\/\*[\s\S]*?\*\//g, '')

    // Remove single-line comments
    let noComments = noMultilineComments.replace(/\/\/.*/g, '')

    return noComments.trim()
}