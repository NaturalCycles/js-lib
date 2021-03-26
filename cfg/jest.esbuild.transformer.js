const { transformSync } = require('esbuild')

const debug = !!process.env.DEBUG_ESBUILD

// https://esbuild.github.io/api/
module.exports = {
  process(src, filename) {
    if (debug) {
      console.log(filename)
    }

    const result = transformSync(src, {
      sourcefile: filename,
      loader: 'ts',
      // platform: 'node',
      format: 'cjs',
      target: 'es2020',
      sourcemap: true,
      //     tsconfigRaw: `{
      //   "compilerOptions": {
      //     "esModuleInterop": false,
      //   },
      // }`,
    })

    // console.log(result.code)

    if (result.warnings.length) {
      console.log(...result.warnings)
    }

    return {
      code: result.code,
      map: result.map,
    }
  },
}
