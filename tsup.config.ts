import { defineConfig } from 'tsup'

export default defineConfig({
    entry: {
      index: 'src/index.ts',

      'utils/is/index': 'src/core/utils/is.ts',
      'utils/mime/index': 'src/core/utils/mime.ts',
      'utils/sanitize/index': 'src/core/utils/sanitize.ts',

      'parsers/json/index': 'src/core/utils/parsers/json.ts',
      'parsers/qs/index': 'src/core/utils/parsers/query-string.ts',
      'parsers/body/index': 'src/core/utils/parsers/req-body.ts',

      'mw/request-id/index': 'src/middlewares/mw-request-id.ts',
      'mw/cors/index': 'src/middlewares/mw-cors.ts',
      'mw/body-parser/index': 'src/middlewares/mw-body-parser.ts'
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    treeshake: true
})
