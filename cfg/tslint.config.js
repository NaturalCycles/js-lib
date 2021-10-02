// formatting rules still have value that IDEs will infer their setting from them
// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/ROADMAP.md
module.exports = {
  rules: {
    // 'no-console': [false, 'debug', 'info', 'time', 'timeEnd', 'trace'],
    // 'no-duplicate-imports': false,
    // 'no-implicit-dependencies': [false, 'dev', ['@app']],
    // 'no-invalid-this': [true, 'check-function-in-method'],
    // 'no-null-keyword': false,
    // 'no-require-imports': false,
    // 'no-shadowed-variable': false,
    // 'no-string-literal': false,
    'no-unused-variable': [true, { 'ignore-pattern': '^_' }], // todo: check it
    'ordered-imports': true, // todo
    // 'unified-signatures': false,
  },
  linterOptions: {
    exclude: ['src/**/__exclude/**/*'],
  },
}
