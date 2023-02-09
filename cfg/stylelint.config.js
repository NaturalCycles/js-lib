module.exports = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'no-empty-source': null,
    'color-hex-length': 'short',
    'length-zero-no-unit': [
      true,
      // keep units in css variables because their absence breaks css calculations
      { ignore: ['custom-properties'] },
    ],
    'declaration-property-value-no-unknown': true,
    // Prettier covers these rules already:
    // 'color-hex-case': 'lower',
    // 'number-leading-zero': 'always',
    // 'number-no-trailing-zeros': true,
  },
}
