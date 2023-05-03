import * as esbuild from 'esbuild-wasm'
import localforage from 'localforage'
import axios from 'axios'

const fileCache = localforage.createInstance({
  name: 'docBookFileCache'
})

export const unpkgPathPlugin = (inputCode: string) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // Called whenever esbuild is trying to determine a particular path for a specific module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args)
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' }
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href
          }
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`
        }
      })

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args)

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
