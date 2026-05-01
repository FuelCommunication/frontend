import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    {
        rules: {
            'no-console': 'warn',
            'prefer-const': 'error',
            'no-undef': 'off',
            'vue/no-unused-refs': 'warn',
            'vue/no-v-html': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
)
