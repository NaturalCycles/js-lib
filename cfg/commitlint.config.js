module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Overriding to allow 'start-case', 'upper-case', 'sentense-case', 'pascal-case'
    // Example to allow now (which weren't allowed before):
    // feat: POST /qa/smth
    'subject-case': [0],
  },
}
