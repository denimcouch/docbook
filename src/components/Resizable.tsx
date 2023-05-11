import '../styles/resizable.css'
import { ResizableBox } from 'react-resizable'

interface ResizableProps {
  resizeDirection: 'horizontal' | 'vertical'
  children: React.ReactElement
}

const Resizable: React.FC<ResizableProps> = ({ resizeDirection, children }) => {
  return (
    <ResizableBox
      height={400}
      width={Infinity}
      resizeHandles={['s']}
      minConstraints={[Infinity, 48]}
      maxConstraints={[Infinity, window.innerHeight * 0.8]}
    >
      {children}
    </ResizableBox>
  )
}

export default Resizable
