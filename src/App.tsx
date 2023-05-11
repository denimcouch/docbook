import { useState } from 'react'
import bundler from './bundler'
import CodeEditor from './components/CodeEditor'
import CodePreview from './components/CodePreview'

const App = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  const handleSubmit = async () => {
    const output = await bundler(input)
    setCode(output)
  }

  return (
    <main>
      <h1 className='is-size-2 has-text-white'>DocBook</h1>
      <div className='codeEditorBlock'>
        <CodeEditor
          onChange={(value = '') => setInput(value)}
          initialValue={input}
          containerClassName='codeEditorBlock__editor'
        />
        <div className='codeEditorBlock__buttons'>
          <button
            className='codeEditorBlock__button codeEditorBlock__button--submit'
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        <div className='codeEditorBlock__preview'>
          <CodePreview code={code} />
        </div>
      </div>
    </main>
  )
}

export default App
