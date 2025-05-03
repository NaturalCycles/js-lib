export default {
  rules: {
    // non-default vue rules
    'vue/block-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/component-api-style': [2, ['script-setup', 'composition', 'composition-vue2']],
    'vue/component-name-in-template-casing': [
      2,
      'PascalCase',
      {
        registeredComponentsOnly: true,
      },
    ],
    'vue/component-options-name-casing': [2, 'PascalCase'],
    'vue/custom-event-name-casing': [2, 'camelCase'],
    'vue/define-emits-declaration': [2, 'type-based'],
    'vue/define-macros-order': 2,
    'vue/define-props-declaration': 2,
    'vue/html-comment-content-spacing': 2,
    'vue/match-component-file-name': [
      2,
      {
        extensions: ['vue', 'jsx'],
        shouldMatchCase: true,
      },
    ],
    'vue/match-component-import-name': 2,
    'vue/no-boolean-default': 2,
    'vue/no-deprecated-model-definition': 2,
    'vue/no-multiple-objects-in-class': 2,
    'vue/no-ref-object-reactivity-loss': 2,
    'vue/no-required-prop-with-default': 2,
    'vue/no-root-v-if': 2,
    'vue/no-this-in-before-route-enter': 2,
    'vue/padding-line-between-blocks': 2,
    'vue/prefer-define-options': 2,
    'vue/prefer-separate-static-class': 2,
    'vue/require-direct-export': 2,
    'vue/require-emit-validator': 2,
    'vue/require-expose': 2,
    'vue/require-macro-variable-name': 2,
    'vue/require-typed-object-prop': 2,
    'vue/require-typed-ref': 2,
    'vue/v-for-delimiter-style': [2, 'of'],
    'vue/valid-define-options': 2,
    'vue/eqeqeq': 2,
    'vue/require-explicit-emits': 2,
    'vue/require-prop-types': 2,
  },
}
