module.exports = {
  rules: {
    '@typescript-eslint/adjacent-overload-signatures': 2,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/ban-types': [
      2,
      {
        types: {
          Object: {
            message:
              'Avoid using the `Object` type. Did you mean `object`? Consider using Record<string, any> instead',
          },
          object: {
            message: [
              'The `object` type is currently hard to use ([see this issue](https://github.com/microsoft/TypeScript/issues/21732)).',
              'Consider using `Record<string, any>` instead, as it allows you to more easily inspect and use the keys.',
            ].join('\n'),
          },
          Boolean: {
            message: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
          },
          Number: {
            message: 'Avoid using the `Number` type. Did you mean `number`?',
          },
          String: {
            message: 'Avoid using the `String` type. Did you mean `string`?',
          },
          Symbol: {
            message: 'Avoid using the `Symbol` type. Did you mean `symbol`?',
          },
        },
      },
    ],
    '@typescript-eslint/consistent-type-assertions': 2,
    '@typescript-eslint/consistent-type-definitions': 2,
    // Doc: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
    // Loosely based on this: https://github.com/xojs/eslint-config-xo-typescript/blob/main/index.js
    '@typescript-eslint/naming-convention': [
      2,
      {
        selector: 'default',
        format: ['camelCase'],
      },
      {
        selector: ['function', 'parameter', 'property', 'method', 'memberLike'],
        format: ['camelCase'],
        leadingUnderscore: 'allowSingleOrDouble',
        trailingUnderscore: 'allowSingleOrDouble',
        // Ignore `{'Retry-After': retryAfter}` type properties.
        filter: {
          regex: '[- ]',
          match: false,
        },
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allowSingleOrDouble',
        trailingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: 'classProperty',
        format: [
          'camelCase',
          'UPPER_CASE',
          'PascalCase', // Frontend sometimes re-exports enums as class properties
        ],
        leadingUnderscore: 'allowSingleOrDouble',
        trailingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: ['objectLiteralProperty', 'objectLiteralMethod', 'typeProperty', 'enumMember'],
        format: [
          'camelCase',
          'UPPER_CASE',
          // only for 3rd-party code/api compatibility! Try to avoid in our code
          'PascalCase',
          'snake_case',
        ],
        leadingUnderscore: 'allowSingleOrDouble',
        trailingUnderscore: 'allowSingleOrDouble',
      },
      // Allow destructured variables to not follow the rules
      {
        selector: ['variable', 'parameter'],
        modifiers: ['destructured'],
        format: null,
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase', 'UPPER_CASE'],
      },
      // Allow these in non-camel-case when quoted.
      {
        selector: [
          'classProperty',
          'objectLiteralProperty',
          'typeProperty',
          'classMethod',
          'objectLiteralMethod',
          'typeMethod',
          'accessor',
          'enumMember',
        ],
        format: null,
        modifiers: ['requiresQuotes'],
      },
    ],
    '@typescript-eslint/no-array-constructor': 2,
    '@typescript-eslint/no-empty-interface': 0, // too inconvenient
    '@typescript-eslint/no-extra-non-null-assertion': 2,
    '@typescript-eslint/no-extra-semi': 0, // prettier handles it
    '@typescript-eslint/no-floating-promises': 2,
    '@typescript-eslint/no-inferrable-types': [
      2,
      {
        ignoreParameters: true,
      },
    ],
    '@typescript-eslint/no-misused-new': 2,
    '@typescript-eslint/no-non-null-asserted-optional-chain': 2,
    '@typescript-eslint/no-this-alias': 0, // buggy
    '@typescript-eslint/no-unused-expressions': 2,
    '@typescript-eslint/prefer-as-const': 2,
    '@typescript-eslint/prefer-for-of': 2,
    '@typescript-eslint/prefer-function-type': 2,
    '@typescript-eslint/prefer-namespace-keyword': 2,
    '@typescript-eslint/promise-function-async': [
      2,
      {
        checkArrowFunctions: false,
        checkFunctionDeclarations: true,
        checkFunctionExpressions: true,
        checkMethodDeclarations: true,
      },
    ],
    '@typescript-eslint/triple-slash-reference': 2,
    complexity: [
      2,
      {
        max: 30,
      },
    ],
    'constructor-super': 2,
    curly: [2, 'multi-line'],
    'eol-last': 2,
    eqeqeq: [2, 'smart'],
    'for-direction': 2,
    'getter-return': 2,
    'id-blacklist': [
      2,
      'any',
      'Number',
      'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'Undefined',
      'undefined',
    ],
    'id-match': 2,
    'import/order': 2,
    // 'import/namespace': 0, // issues with e.g globby
    // 'import/no-unresolved': 0, // breaks for type-aliases, e.g '@/store'
    // 'import/no-duplicates': 0,
    'jsdoc/check-alignment': 2,
    // "jsdoc/check-indentation": "error",
    'jsdoc/newline-after-description': 2,
    'no-array-constructor': 'off',
    'no-async-promise-executor': 2,
    'no-bitwise': 2,
    'no-caller': 2,
    'no-case-declarations': 2,
    'no-class-assign': 2,
    'no-compare-neg-zero': 2,
    'no-cond-assign': 2,
    'no-const-assign': 2,
    'no-constant-condition': 2,
    'no-control-regex': 2,
    'no-debugger': 2,
    'no-delete-var': 2,
    'no-dupe-args': 2,
    'no-dupe-class-members': 2,
    'no-dupe-else-if': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty': [2, { allowEmptyCatch: true }],
    'no-empty-character-class': 2,
    'no-empty-function': 'off',
    'no-empty-pattern': 2,
    'no-eval': 2,
    'no-ex-assign': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-semi': 'off',
    'no-fallthrough': 2,
    'no-func-assign': 2,
    'no-global-assign': 2,
    'no-import-assign': 0, // used in some unit tests
    'no-inner-declarations': 2,
    'no-invalid-regexp': 2,
    'no-invalid-this': 0, // too many false positives in valid classes
    'no-irregular-whitespace': 2,
    'no-misleading-character-class': 2,
    'no-mixed-spaces-and-tabs': 2,
    'no-new-symbol': 2,
    'no-new-wrappers': 2,
    'no-obj-calls': 2,
    'no-octal': 2,
    'no-prototype-builtins': 2,
    'no-redeclare': 2,
    'no-regex-spaces': 2,
    'no-restricted-imports': [
      2,
      'rxjs/Rx',
      'rxjs/internals',
      'rxjs/Observable',
      'rxjs/Observer',
      'rxjs/Subject',
      'rxjs/observable/defer',
      'rxjs/observable/merge',
      'rxjs/observable/of',
      'rxjs/observable/timer',
      'rxjs/observable/combineLatest',
      'rxjs/add/observable/combineLatest',
      'rxjs/add/observable/of',
      'rxjs/add/observable/merge',
      'rxjs/add/operator/debounceTime',
      'rxjs/add/operator/distinctUntilChanged',
      'rxjs/add/operator/do',
      'rxjs/add/operator/filter',
      'rxjs/add/operator/map',
      'rxjs/add/operator/retry',
      'rxjs/add/operator/startWith',
      'rxjs/add/operator/switchMap',
      'rxjs/observable/interval',
      'rxjs/observable/forkJoin',
    ],
    'no-self-assign': 2,
    'no-setter-return': 2,
    'no-shadow': 0, // it is buggy with TypeScript enums
    'no-shadow-restricted-names': 2,
    'no-sparse-arrays': 2,
    'no-this-before-super': 2,
    'no-throw-literal': 2,
    'no-undef': 2,
    'no-undef-init': 2,
    'no-underscore-dangle': 0,
    'no-unexpected-multiline': 0, // prettier
    'no-unreachable': 2,
    'no-unsafe-finally': 2,
    'no-unsafe-negation': 2,
    'no-unused-labels': 2,
    'no-useless-catch': 2,
    'no-useless-escape': 2,
    'no-unneeded-ternary': 2,
    'no-duplicate-imports': 0, // too many false-positives (with e.g import type + import on next line)
    'no-var': 2,
    'no-with': 2,
    'object-shorthand': 2,
    'one-var': [2, 'never'],
    'prefer-const': [
      2,
      {
        destructuring: 'all',
      },
    ],
    'require-yield': 2,
    'spaced-comment': [
      2,
      'always',
      {
        markers: ['/'],
      },
    ],
    'use-isnan': 2,
    'valid-typeof': 2,
    'no-await-in-loop': 2,
    'no-extend-native': 2,
    'guard-for-in': 2,
    'jest/expect-expect': 0,
    'jest/no-commented-out-tests': 0,
    'jest/no-export': 0, // conflicts with typescript isolatedModules
    'jest/no-conditional-expect': 0,
    'jest/no-disabled-tests': 0,
    '@typescript-eslint/no-namespace': [
      2,
      {
        allowDeclarations: true, // allows `namespace NodeJS {}` augmentations
      },
    ],
    'no-unused-vars': 0, // replaced by `unused-imports/no-unused-vars`
    '@typescript-eslint/no-unused-vars': [
      0, // replaced by `unused-imports/no-unused-vars`
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    'unused-imports/no-unused-imports': 2,
    'unused-imports/no-unused-vars': [
      2,
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-module-boundary-types': [
      2,
      {
        allowArgumentsExplicitlyTypedAsAny: true,
      },
    ],
    '@typescript-eslint/array-type': 2,
    '@typescript-eslint/prefer-regexp-exec': 0, // auto-fixer breaks code sometimes!
    'arrow-parens': [2, 'as-needed'],
    'arrow-body-style': 0,
    'unicorn/no-array-callback-reference': 0, // false positives
    'unicorn/no-process-exit': 0,
    'unicorn/no-array-push-push': 0,
    'unicorn/no-abusive-eslint-disable': 0,
    'unicorn/number-literal-case': 0, // conflicts with prettier
    'unicorn/prevent-abbreviations': 0,
    'unicorn/prefer-module': 0,
    'unicorn/no-null': 0,
    'unicorn/filename-case': 0,
    'unicorn/prefer-node-protocol': 0,
    'unicorn/prefer-set-has': 0,
    'unicorn/explicit-length-check': 0,
    'unicorn/no-array-for-each': 0,
    'unicorn/import-style': 0, // todo: fix
    'unicorn/prefer-spread': 0, // fails on joiSchema.concat() which is not an array!
    'unicorn/better-regex': 0, // we still believe that [0-9] is clearer than [\d]
    'unicorn/no-object-as-default-parameter': 0, // doesn't allow e.g method (opt = { skipValidation: true })
    'unicorn/catch-error-name': [
      2,
      {
        name: 'err',
        ignore: [/^err\d*$/, /^_/],
      },
    ],
    'unicorn/prefer-switch': 0,
    'unicorn/no-useless-undefined': 0,
    'unicorn/prefer-ternary': [0, 'only-single-line'], // single-line doesn't really work, hence disabled
    'unicorn/numeric-separators-style': [2, { onlyIfContainsSeparator: true }],
    'unicorn/consistent-destructuring': 0, // todo: enable later
    'unicorn/no-nested-ternary': 0,
    'unicorn/consistent-function-scoping': 0, // todo: consider enabling later
    'unicorn/no-this-assignment': 0,
    'unicorn/prefer-string-slice': 0,
    'unicorn/prefer-number-properties': 0,
    'unicorn/prefer-negative-index': 0,
    'unicorn/prefer-regexp-test': 0,
    'unicorn/prefer-query-selector': 0,
    'unicorn/prefer-prototype-methods': 0, // false-positive on node promisify() of callback functions
    '@typescript-eslint/return-await': [2, 'always'],
    '@typescript-eslint/require-await': 0,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
    '@typescript-eslint/no-unsafe-return': 0,
    '@typescript-eslint/restrict-plus-operands': 0,
    '@typescript-eslint/unbound-method': 0,
    '@typescript-eslint/no-unsafe-argument': 0, // prevents "legit" use of `any`
    'unicorn/prefer-export-from': 0, // breaks auto-imports in IntelliJ Idea
  },
}
