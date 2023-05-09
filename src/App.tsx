import * as esbuild from 'esbuild-wasm'
import { useEffect, useRef, useState } from 'react'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'

const App = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iframe = useRef<any>()
  const [input, setInput] = useState('')
  const env = ['process', 'env', 'NODE_ENV'].join('.')

  // init esbuild service
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    })
  }

  useEffect(() => {
    startService()
  }, [])

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.getElementById('root');
              root.innerHTML = '<div style="border: 2px red solid; padding: .5rem;"><h4>Runtime Error</h4>' + err + '/div';
              console.error(err);
            }
          }, false)
        </script>
      </body>
    </html>
  `

  const handleSubmit = async () => {
    if (!ref.current) return

    // refresh the iframe with clean env
    iframe.current.srcdoc = html

    // transpiles and bundles user code
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        [env]: '"production"',
        global: 'window'
      }
    })

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*')
  }

  return (
    <main>
      <h1>DocBook</h1>
      <div className='codeEditorBlock'>
        <textarea
          className='codeEditorBlock__editor'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <div className='codeEditorBlock__buttons'>
          <button
            className='codeEditorBlock__button codeEditorBlock__button--submit'
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        <div className='codeEditorBlock__preview'>
          <iframe
            ref={iframe}
            title='code preview'
            src='true'
            srcDoc={html}
            sandbox='allow-scripts'
          ></iframe>
        </div>
      </div>
    </main>
  )
}

export default App
