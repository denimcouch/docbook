import '../styles/resizable.css'
import { ResizableBox, ResizableBoxProps } from 'react-resizable'

interface ResizableProps {
  resizeDirection: 'horizontal' | 'vertical'
  children: React.ReactElement
}

const Resizable: React.FC<ResizableProps> = ({ resizeDirection, children }) => {
  const resizableProps: ResizableBoxProps =
    resizeDirection === 'vertical'
      ? {
          height: 400,
          width: Infinity,
          resizeHandles: ['s'],
          minConstraints: [Infinity, 48],
          maxConstraints: [Infinity, window.innerHeight * 0.8]
        }
      : {
          height: Infinity,
          width: window.innerWidth * 0.75,
          resizeHandles: ['e'],
          minConstraints: [window.innerWidth * 0.35, Infinity],
          maxConstraints: [window.innerWidth * 0.75, Infinity],
          className: 'resize-horizontal'
        }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>
}

export default Resizable
