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
      // Handles our specific root entry point
      build.onLoad({ filter: /^index\.js$/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode
        }
      })

      // Handles checking for file in cache.
      // Will continue to next onLoad blocks if file isn't found in cache
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        )

        if (cachedResult) {
          return cachedResult
        }
      })

      // Handles any css files
      // Note: will throw an error with files that contain @import and/or url()
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path)

        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")
        const contents = `
          const style = document.createElement('style')
          style.innerText = '${escaped}'
          document.head.appendChild(style)
        `

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: contents,
          resolveDir: new URL('./', request.responseURL).pathname
        }
        // Store it in the cache
        await fileCache.setItem(args.path, result)

        return result
      })

      // Handles all other modules
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path)

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname
        }
        // Store it in the cache
        await fileCache.setItem(args.path, result)

        return result
      })
    }
  }
}
