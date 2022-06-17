import { useEffect, useState } from 'react'
import chains from '../utils/chains'

export const useAccount = (networkId = 'local') => {
  const [account, setCurrentAccount] = useState(null)
  const [componentMounted, setComponentMounted] = useState(false)

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Make sure you have MetaMask!')
        return
      } else {
        console.log('We have the ethereum object', ethereum)
        const accounts = await ethereum.request({ method: 'eth_accounts' })

        if (accounts.length !== 0) {
          const _account = accounts[0]
          console.log('Found an authorized account:', _account)
          setCurrentAccount(_account)
          checkNetwork()
        } else {
          console.log('No authorized account found')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })

      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== chains[networkId].id) {
        alert(`Please connect to ${chains[networkId].name}!`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    setComponentMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [account, connectWalletAction, componentMounted]
}