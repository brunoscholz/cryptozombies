import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'

import LoadingIndicator from './Components/LoadingIndicator'
import chains from './utils/chains'
import { CONTRACT_ADDRESS } from './utils/constants'

import ZombieFactory from './truffle/abis/ZombieFactory.json'

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null)
  const [characterNFT, setCharacterNFT] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Make sure you have MetaMask!')
        setIsLoading(false)
        return
      } else {
        console.log('We have the ethereum object', ethereum)
        const accounts = await ethereum.request({ method: 'eth_accounts' })

        if (accounts.length !== 0) {
          const account = accounts[0]
          console.log('Found an authorized account:', account)
          setCurrentAccount(account)
          checkNetwork()
        } else {
          console.log('No authorized account found')
        }
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
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
      if (window.ethereum.networkVersion !== chains.local.id) {
        alert(`Please connect to ${chains.local.name}!`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    checkIfWalletIsConnected()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const gameContract = new ethers.Contract(ZombieFactory.networks[chains.local.id].address, ZombieFactory.abi, signer)

      // const txn = await gameContract.checkIfUserHasNFT()
      // if (txn.name) {
      //   console.log('User has character NFT')
      //   setCharacterNFT(txn) // transformCharacterData
      // } else {
      //   console.log('No character NFT found')
      // }

      setIsLoading(false)
    }

    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount)
      fetchNFTMetadata()
    }
  }, [currentAccount])

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />
    }

    if (!currentAccount) {
      return (
        <div className='connect-wallet-container'>
          <img src='https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv' alt='Monty Python Gif' />
          <button className='cta-button connect-wallet-button' onClick={connectWalletAction}>
            Connect Wallet To Get Started
          </button>
        </div>
      )
    } else if (currentAccount && !characterNFT) {
      return (
        <div>
          <p>No Character</p>
        </div>
      )
      // return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return (
        <div>
          <p>All set</p>
        </div>
      )
      // return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} currentAccount={currentAccount} />;
    }
  }

  return (
    <div className='App'>
      <div className='container'>
        <div className='header-container'>
          <p className='header gradient-text'>⚔️ Cryptozombies MOBA ⚔️</p>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default App
