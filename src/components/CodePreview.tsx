import '../styles/code-preview.css'
import { useRef, useEffect } from 'react'

interface CodePreviewProps {
  code: string
  errMsg: string
  containerClassName?: string
}

const html = `
<html>
  <head>
    <style>html {background-color: #fff;}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const handleError = (err) => {
        const root = document.getElementById('root');
        root.innerHTML = '<div style="border: 2px red solid; padding: .5rem;"><h4>Runtime Error</h4>' + err + '/div';
        console.error(err);
      };
      window.addEventListener('error', (event) => {
        event.preventDefault();
        handleError(event.error);
      });
      window.addEventListener('message', (event) => {
        try {
          eval(event.data);
        } catch (err) {
          handleError(err);
        }
      }, false);
    </script>
  </body>
</html>
`

const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  errMsg,
  containerClassName
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iframe = useRef<any>()

  useEffect(() => {
    // refresh the iframe with clean env
    iframe.current.srcdoc = html

    const timer = setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*')
    }, 50)

    return () => {
      clearTimeout(timer)
    }
  }, [code])

  return (
    <div className={`preview ${containerClassName ?? ''}`}>
      {errMsg && <div className='preview__error'>{errMsg}</div>}
      <iframe
        ref={iframe}
        title='code preview'
        srcDoc={html}
        src='true'
        sandbox='allow-scripts'
      />
    </div>
  )
}

export default CodePreview
