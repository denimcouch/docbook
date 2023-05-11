import { useState } from 'react'
import bundler from '../bundler'
import CodeEditor from './CodeEditor'
import CodePreview from './CodePreview'

const CodeBlock = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  const handleSubmit = async () => {
    const output = await bundler(input)
    setCode(output)
  }

  return (
    <div className='codeBlock'>
      <CodeEditor
        onChange={(value = '') => setInput(value)}
        initialValue={input}
        containerClassName='codeBlock__editor'
      />
      <div className='codeBlock__buttons'>
        <button
          className='codeBlock__button codeBlock__button--submit'
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <CodePreview code={code} containerClassName='codeBlock__preview' />
    </div>
  )
}

export default CodeBlock
