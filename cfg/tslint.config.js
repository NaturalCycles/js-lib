// formatting rules still have value that IDEs will infer their setting from them
module.exports = {
  rules: {
    'class-name': true,
    // 'interface-name': [false, 'never-prefix'],
    // 'no-console': [false, 'debug', 'info', 'time', 'timeEnd', 'trace'],
    // 'no-duplicate-imports': false,
    'no-floating-promises': true,
    // 'no-implicit-dependencies': [false, 'dev', ['@app']],
    'no-invalid-this': [true, 'check-function-in-method'],
    // 'no-null-keyword': false,
    // 'no-require-imports': false,
    // 'no-shadowed-variable': false,
    // 'no-string-literal': false,
    'no-unused-variable': [true, { 'ignore-pattern': '^_' }], // todo: check it
    'ordered-imports': true, // todo
    'promise-function-async': [
      true,
      'check-function-declaration',
      'check-function-expression',
      'check-method-declaration',
    ],
    typedef: [true, 'property-declaration'], // todo
    // 'unified-signatures': false,
    'variable-name': [
      true,
      'ban-keywords',
      'check-format',
      'allow-pascal-case',
      'allow-leading-underscore',
    ],
  },
  linterOptions: {
    exclude: ['src/**/__exclude/**/*'],
  },
}
