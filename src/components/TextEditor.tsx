import '../styles/text-editor.css'
import { useEffect, useState, useRef } from 'react'
import MDEditor from '@uiw/react-md-editor'

const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('## Try Writing Something!')
  const editorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // This listener function checks if the user clicks inside the text editor.
    // We only want to switch between editor views if the user clicks outside of the editor.
    const listener = (e: MouseEvent) => {
      const insideEditor =
        editorRef.current &&
        e.target &&
        editorRef.current.contains(e.target as Node)

      if (insideEditor) {
        return
      }

      setEditing(false)
    }

    document.addEventListener('click', listener, { capture: true })

    return () => {
      document.removeEventListener('click', listener, { capture: true })
    }
  }, [])

  if (editing) {
    return (
      <div ref={editorRef} className='textEditor textEditor--editing'>
        <MDEditor value={value} onChange={(newVal) => setValue(newVal || '')} />
      </div>
    )
  }

  return (
    <div className='textEditor card' onClick={() => setEditing(true)}>
      <MDEditor.Markdown className='card-content' source={value} />
    </div>
  )
}
export default TextEditor
