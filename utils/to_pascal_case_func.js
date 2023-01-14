function toPascalCase (str) {
    return str.replace(/(^|\s)[a-z]/g, char => char.toUpperCase())
}

module.exports = {
    toPascalCase
}