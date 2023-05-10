import { useRef } from 'react'
import Editor, { OnChange, OnMount } from '@monaco-editor/react'
import prettier from 'prettier'
import parser from 'prettier/parser-babel'
import '../styles/code-editor.css'

interface CodeEditorProps {
  onChange: OnChange
  initialValue?: string
  containerClassName?: string
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  onChange,
  initialValue,
  containerClassName
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>()

  const onEditorMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  const handleFormat = () => {
    // get current value from editor
    const unformattedVal = editorRef.current.getModel().getValue()

    // format that value
    const formattedVal = prettier.format(unformattedVal, {
      parser: 'babel',
      plugins: [parser],
      useTabs: true,
      tabWidth: 2,
      semi: false,
      singleQuote: true
    })

    // set the formatted value back in the editor
    editorRef.current.setValue(formattedVal)
  }

  return (
    <div className={`editor ${containerClassName ?? ''}`}>
      <button
        className='button button-format is-primary is-small'
        onClick={handleFormat}
      >
        Format
      </button>
      <Editor
        onMount={onEditorMount}
        onChange={onChange}
        value={initialValue ?? '// try writing some JavaScript!'}
        height='400px'
        defaultLanguage='javascript'
        language='javascript'
        theme='vs-dark'
        options={{
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'bounded',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false
        }}
      />
    </div>
  )
}

export default CodeEditor
