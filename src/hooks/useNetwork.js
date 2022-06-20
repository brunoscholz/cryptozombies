import { useEffect, useState } from 'react'

const useNetwork = (ethereum) => {
  const [network, setNetwork] = useState('')

  const getNetwork = async () => {
    try {
      const chainId = await ethereum.request({ method: 'eth_chainId' })
      const net = networks[chainId]
      setNetwork(net)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChainChanged = _chainId => {
    window.location.reload()
  }

  const checkNetwork = deployed => {
    return deployed.id === network.id
  }

  const switchNetwork = async deployed => {
    if (ethereum) {
      try {
        // Try to switch to the Mumbai testnet
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: deployed.chainId }] // Check networks.js for hexadecimal network ids
        })
      } catch (error) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [deployed]
            })
          } catch (error) {
            console.log(error)
          }
        }
        console.log(error)
      }
    }
  }

  useEffect(() => {
    if (!ethereum) return
    getNetwork()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereum])

  useEffect(() => {
    if (!network) return
    ethereum.on('chainChanged', handleChainChanged)

    return () => {
      ethereum.off('chainChanged', handleChainChanged)
    }
  }, [ethereum, network])

  return { network, setNetwork, checkNetwork, switchNetwork }
}

const networks = {
  '0x1': {
    id: 1,
    chainName: 'Mainnet',
    nick: 'main',
    chainId: '0x1',
    rpcUrls: [],
    nativeCurrency: {
      name: 'ETHER',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: []
  },
  '0x3': {
    id: 3,
    chainName: 'Ropsten',
    nick: 'ropsten',
    chainId: '0x3',
    rpcUrls: [],
    nativeCurrency: {
      name: 'ETHER',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: []
  },
  '0x2a': {
    id: 42,
    chainName: 'Kovan',
    nick: 'kovan',
    chainId: '0x2a',
    rpcUrls: [],
    nativeCurrency: {
      name: 'ETHER',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: []
  },
  '0x4': {
    id: 4,
    chainName: 'Rinkeby',
    nick: 'rinkeby',
    chainId: '0x4',
    rpcUrls: [],
    nativeCurrency: {
      name: 'ETHER',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: []
  },
  '0x5': {
    id: 5,
    chainName: 'Goerli',
    nick: 'goerli',
    chainId: '0x5',
    rpcUrls: [],
    nativeCurrency: {
      name: 'ETHER',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: []
  },
  '0x61': {
    id: 97,
    chainName: 'BSC Testnet',
    nick: 'bsctest',
    chainId: '0x61',
    rpcUrls: [],
    nativeCurrency: {
      name: 'ETHER',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: []
  },
  '0x38': {
    id: 56,
    chainName: 'BSC Mainnet',
    nick: 'bsc',
    chainId: '0x38',
    rpcUrls: [],
    nativeCurrency: {
      name: 'ETHER',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: []
  },
  '0x89': {
    id: 137,
    chainName: 'Polygon Mainnet',
    nick: 'polygon',
    chainId: '0x89',
    rpcUrls: [],
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18
    },
    blockExplorerUrls: []
  },
  '0x13881': {
    id: 80001,
    chainName: 'Polygon Mumbai Testnet',
    nick: 'mumbai',
    chainId: '0x13881',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    nativeCurrency: {
      name: 'Mumbai Matic',
      symbol: 'MATIC',
      decimals: 18
    },
    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
  },
  '0xa86a': {
    id: 43114,
    chainName: 'AVAX Mainnet',
    nick: 'avax',
    chainId: '0xa86a',
    rpcUrls: [],
    nativeCurrency: {
      name: 'ETHER',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: []
  },
  '0x539': {
    id: 5777,
    chainName: 'Ganache Local',
    nick: 'local',
    chainId: '0x539',
    rpcUrls: [],
    nativeCurrency: {
      name: 'ETHER',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: []
  }
}

export { useNetwork, networks }

// const networks = {
//   "0x1": "Mainnet",
//   "0x3": "Ropsten",
//   "0x2a": "Kovan",
//   "0x4": "Rinkeby",
//   "0x5": "Goerli",
//   "0x61": "BSC Testnet",
//   "0x38": "BSC Mainnet",
//   "0x89": "Polygon Mainnet",
//   "0x13881": "Polygon Mumbai Testnet",
//   "0xa86a": "AVAX Mainnet",
//   "0x1691": "Ganache Local"
// }
