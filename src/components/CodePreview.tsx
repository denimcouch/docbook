import { useRef, useEffect } from 'react'

interface CodePreviewProps {
  code: string
}

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

const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iframe = useRef<any>()

  useEffect(() => {
    // refresh the iframe with clean env
    iframe.current.srcdoc = html

    iframe.current.contentWindow.postMessage(code, '*')
  }, [code])

  return (
    <iframe
      ref={iframe}
      title='code preview'
      srcDoc={html}
      src='true'
      sandbox='allow-scripts'
    />
  )
}

export default CodePreview
