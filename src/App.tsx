import * as esbuild from 'esbuild-wasm'
import { useEffect, useRef, useState } from 'react'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'

const App = () => {
  const ref = useRef<any>()
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')
  const { ENV_KEY } = import.meta.env

  // init esbuild service
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    })
  }

  useEffect(() => {
    startService()
  }, [])

  const handleSubmit = async () => {
    if (!ref.current) return

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        [ENV_KEY]: '"production"',
        global: 'window'
      }
    })

    setCode(result.outputFiles[0].text)
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
          <pre>{code}</pre>
        </div>
      </div>
    </main>
  )
}

export default App
