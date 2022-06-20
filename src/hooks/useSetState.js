import React from 'react'

/**
 *
 * wrapper for setState update variables by name
 * @param {*} initState
 * @returns
 */
export const useSetState = initState => {
  const [state, setState] = React.useState(initState)

  const setMergeState = value => {
    setState(prevValue => {
      const newValue = typeof value === 'function' ? value(prevValue) : value
      return newValue ? { ...prevValue, ...newValue } : prevValue
    })
  }

  return [state, setMergeState]
}

/*
const useSetStateDemo = () => {
  const [person, setPerson] = useSetState({
    name: 'your name',
    age: 64
  })

  const onSetName = () => {
    setPerson({name: 'another name'})
  }

  const onSetAge = () => {
    setPerson(() => {
      return {
        age: 133
      }
    })
  }

  return (
    <div>
      <p>name: {person.name}</p>
      <p>age: {person.age}</p>
      <button onClick={onSetName}>change name</button>
      <button onClick={onSetAge}>change age</button>
    </div>
  )
}
********************/