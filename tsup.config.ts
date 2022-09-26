import { defineConfig } from 'tsup'

export default defineConfig({
    entry: {
      index: 'src/index.ts',

      'utils/is': 'src/core/utils/is.ts',
      'utils/mime': 'src/core/utils/mime.ts',
      'utils/sanitize': 'src/core/utils/sanitize.ts',

      'utils/parsers/json': 'src/core/utils/parsers/json.ts',
      'utils/parsers/qs': 'src/core/utils/parsers/query-string.ts',
      'utils/parsers/body': 'src/core/utils/parsers/req-body.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true
})
