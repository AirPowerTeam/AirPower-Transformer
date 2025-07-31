// eslint.config.mjs
import config from '@antfu/eslint-config'

export default config({
  stylistic: {
    indent: 2, // 缩进风格
    semi: false,
  },
  typescript: {
    overrides: {
      'unicorn/error-message': 'off',
    },
  },
  gitignore: false,
  ignores: ['dist', '.idea', '.vscode'],
  vue: false,
})
