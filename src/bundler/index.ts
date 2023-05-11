import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin'
import { fetchPlugin } from '../plugins/fetch-plugin'

const env = ['process', 'env', 'NODE_ENV'].join('.')
let service: esbuild.Service

export default async (rawCode: string) => {
  // initialize esbuild
  // transpile and bundle rawCode once we're sure esbuild initialized
  // return the result
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    })
  }

  const result = await service.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    define: {
      [env]: '"production"',
      global: 'window'
    }
  })

  return result.outputFiles[0].text
}
