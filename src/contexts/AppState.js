import React, { createContext, useReducer, useContext } from 'react'
import { object, func } from 'prop-types'

const Context = createContext()

export function AppStateProvider({ reducer, initialState = {}, children }) {
  const value = useReducer(reducer, initialState)

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

AppStateProvider.propTypes = {
  reducer: func,
  initialState: object,
}

export const useAppState = () => {
  return useContext(Context)
}

export const useIPFS = () => {
  const resolveLink = (url) => {
    if (!url || !url.includes("ipfs://")) return url;
    return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
  };

  return { resolveLink };
};