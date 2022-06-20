import React from 'react'

/**
 *
 * executes only once when component mounts, not on re-renders
 * @param {*} callback
 */
export const useMount = callback => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(callback, [])
}

/*
const useMountDemo = () => {
  const [count, setCount] = React.useState(0)

  useMount(() => {
    console.log('useMount')
  })

  return (
    <div>
      Count: {count}
      <button onClick={() => setCount(count + 1)}>add</button>
    </div>
  )
}
 ********************/