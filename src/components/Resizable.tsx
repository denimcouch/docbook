import { useEffect, useState } from 'react'
import '../styles/resizable.css'
import { ResizableBox, ResizableBoxProps } from 'react-resizable'

interface ResizableProps {
  resizeDirection: 'horizontal' | 'vertical'
  children: React.ReactElement
}

const Resizable: React.FC<ResizableProps> = ({ resizeDirection, children }) => {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight)
  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const [width, setWidth] = useState(innerWidth * 0.75)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const listener = () => {
      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight)
        setInnerWidth(window.innerWidth)
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75)
        }
      }, 100)
    }

    window.addEventListener('resize', listener)

    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [width])

  const resizableProps: ResizableBoxProps =
    resizeDirection === 'vertical'
      ? {
          height: 400,
          width: Infinity,
          resizeHandles: ['s'],
          minConstraints: [Infinity, 48],
          maxConstraints: [Infinity, innerHeight * 0.8]
        }
      : {
          height: Infinity,
          width,
          resizeHandles: ['e'],
          minConstraints: [innerWidth * 0.35, Infinity],
          maxConstraints: [innerWidth * 0.75, Infinity],
          className: 'resize-horizontal',
          onResizeStop(_e, data) {
            setWidth(data.size.width)
          }
        }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>
}

export default Resizable
