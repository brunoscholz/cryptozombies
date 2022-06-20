export const initialState = {
  wallet: null,
  account: null,
  network: null,
  nft: null,
  army: {
    loaded: false,
    data: []
  }
}

export const walletReducer = (state, action) => {
  switch (action.type) {
    case 'WALLET_LOADED':
      return {
        ...state,
        wallet: action.payload // window.ethereum = metamask
      }
    case 'ACCOUNT_LOADED':
      return {
        ...state,
        account: action.payload
      }
    case 'NETWORK_LOADED':
      return {
        ...state,
        network: action.payload
      }
    case 'ETHER_BALANCE_LOADED':
      return {
        ...state,
        balance: action.payload
      }
    default:
      return state
  }
}

export const nftReducer = (state, action) => {
  switch (action.type) {
    case 'CONTRACT_LOADED':
      return {
        ...state,
        nft: {
          ...state.nft,
          loaded: true,
          contract: action.payload
        }
      }
    default:
      return state
  }
}

export const armyReducer = (state, action) => {
  switch (action.type) {
    case 'ALL_ZOMBIES_LOADED':
      return {
        ...state,
        army: {
          ...state.army,
          loaded: true,
          data: action.payload
        }
      }
    case 'ZOMBIE_LOADED':
    case 'ZOMBIE_CREATED':
      return {
        ...state,
        army: {
          ...state.army,
          loaded: true,
          data: [...state.army.data, action.payload]
        }
      }
    default:
      return state
  }
}

export const combineReducers = reducers => {
  return (state, action) => {
    return Object.keys(reducers).reduce((acc, prop) => {
      return {
        ...acc,
        ...reducers[prop]({ [prop]: acc[prop] }, action)
      }
    }, state)
  }
}