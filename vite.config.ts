/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [ ...configDefaults.exclude, './tests/**.test.ts' ]
  },
})
