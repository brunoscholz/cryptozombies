import React from 'react'

/**
 *
 * executes only on re-renders when dependencies update
 * @param {*} effectCallback
 * @param {*} deps
 */
export const useUpdateEffect = (effectCallback, deps = []) => {
  const isFirstMount = React.useRef(false)

  React.useEffect(() => {
    return () => {
      isFirstMount.current = false
    }
  }, [])

  React.useEffect(() => {
    // do not execute effectCallback for the first time
    if (!isFirstMount.current) {
      isFirstMount.current = true
    } else {
      return effectCallback()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/*
const useUpdateEffectDemo = () => {
  const [count, setCount] = React.useState(0)

  useUpdateEffect(() => {
    console.log('Count changed', count)
  }, [count])

  return (
    <div>
      Count: {count}
      <button onClick={() => setCount(count + 1)}>add</button>
    </div>
  )
}
 ********************/