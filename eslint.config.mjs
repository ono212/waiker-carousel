import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      semi: ['error', 'always'],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      strict: ['error', 'global'], // strict 모드 강제
      indent: ['error', 2], // 2칸 들여쓰기
      'no-multiple-empty-lines': ['error', { max: 1 }], // 최대 빈 줄 개수 1줄로 설정
      'arrow-body-style': ['error', 'as-needed'], // 불필요한 중괄호 제거
      'no-console': 'warn', // console.log 사용 경고
      'no-extra-semi': 'error', // 불필요한 세미콜론 에러
      'quote-props': ['error', 'as-needed'], // 필요한 경우에만 따옴표 사용
    },
  },
  pluginJs.configs.recommended,
];
