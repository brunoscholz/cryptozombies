import { useEffect, useState } from 'react'

const useAccount = (ethereum) => {
  const [account, setCurrentAccount] = useState(null)
  const [componentMounted, setComponentMounted] = useState(false)

  const checkIfWalletIsConnected = async () => {
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length !== 0) {
        const _account = accounts[0]
        console.log('Found an authorized account:', _account)
        setCurrentAccount(_account)
      } else {
        console.log('No authorized account found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWalletAction = async () => {
    try {
      if (!ethereum) {
        console.log('Get MetaMask!')
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

  useEffect(() => {
    if (!ethereum) return
    checkIfWalletIsConnected()
    setComponentMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereum])

  return [account, connectWalletAction, componentMounted]
}

export { useAccount }
