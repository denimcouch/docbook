import * as esbuild from 'esbuild-wasm'
import localforage from 'localforage'
import axios from 'axios'

const fileCache = localforage.createInstance({
  name: 'docBookFileCache'
})

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode
          }
        }

        // First, we check if we have already fetched this file
        // and if it is stored in the cache.
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        )

        // If so, then return immediately.
        if (cachedResult) {
          return cachedResult
        }

        // If we haven't, then fetch the file.
        const { data, request } = await axios.get(args.path)

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname
        }
        // Then store it in the cache
        await fileCache.setItem(args.path, result)

        return result
      })
    }
  }
}
