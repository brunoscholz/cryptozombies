import React from 'react'

/**
 *
 * executes only once when component unmounts
 * @param {*} callback
 */
export const useUnmount = callback => {
  const callbackRef = React.useRef(callback)
  callbackRef.current = callback
  React.useEffect(() => {
    return () => {
      callbackRef.current()
    }
  }, [])
}

/*
const Child = () => {
  const [count, setCount] = React.useState(0)

  useUnmount(() => {
    console.log('useUnmount', count)
  })

  return (
    <div>
      Count: {count}
      <button onClick={() => setCount(count + 1)}>add</button>
    </div>
  )
}

const useUnmountDemo = () => {
  const [showChild, setShowChild] = React.useState(true)

  return (
    <div>
      {!showChild && <Child />}
      <button onClick={() => setShowChild(false)}>Destroy Child</button>
    </div>
  )
}
********************/