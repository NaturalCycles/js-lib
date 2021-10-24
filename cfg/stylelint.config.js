module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier'],
  rules: {
    'no-empty-source': null,
    'length-zero-no-unit': true,
    'color-hex-length': 'short',
    // Prettier covers these rules already:
    // 'color-hex-case': 'lower',
    // 'number-leading-zero': 'always',
    // 'number-no-trailing-zeros': true,
  },
}
