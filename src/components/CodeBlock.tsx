import '../styles/code-block.css'
import { useState, useEffect } from 'react'
import bundler from '../bundler'
import CodeEditor from './CodeEditor'
import CodePreview from './CodePreview'
import Resizable from './Resizable'

const CodeBlock = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundler(input)
      setCode(output)
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [input])

  return (
    <section className='codeBlock'>
      <Resizable resizeDirection='vertical'>
        <div className='codeBlock__wrapper'>
          <Resizable resizeDirection='horizontal'>
            <CodeEditor
              onChange={(value = '') => setInput(value)}
              initialValue={input}
              containerClassName='codeBlock__editor'
            />
          </Resizable>
          <CodePreview code={code} containerClassName='codeBlock__preview' />
        </div>
      </Resizable>
    </section>
  )
}

export default CodeBlock
