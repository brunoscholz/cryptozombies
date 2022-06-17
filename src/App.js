import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'

import LoadingIndicator from './Components/LoadingIndicator'
import chains from './utils/chains'

import ZombieFeeding from './truffle/abis/ZombieFeeding.json'
import { useAccount } from './hooks'

const App = () => {
  const [account, connectWalletAction] = useAccount('local')
  const [characterNFT, setCharacterNFT] = useState(null)
  const [gameContract, setGameContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    // checkIfWalletIsConnected()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', account)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const gameContract = new ethers.Contract(ZombieFeeding.networks[chains.local.id].address, ZombieFeeding.abi, signer)

      // const txn = await gameContract.checkIfUserHasNFT()
      // if (txn.name) {
      //   console.log('User has character NFT')
      //   setCharacterNFT(txn) // transformCharacterData
      // } else {
      //   console.log('No character NFT found')
      // }

      setGameContract(gameContract)
      setIsLoading(false)
    }

    if (account) {
      console.log('CurrentAccount:', account)
      fetchNFTMetadata()
    }
  }, [account])

  useEffect(() => {
    const onZombieMint = async (zombieId, name, dna) => {
      console.log(
        `New Zombie Created - ID: ${zombieId.toNumber()} name: ${name} DNA: ${dna.toNumber()}`
      );

      if (gameContract) {
        const character = await gameContract.getMyZombie();
        console.log('Character: ', character);
        setCharacterNFT(character);
      }
    };

    if (gameContract) {
      gameContract.on('NewZombie', onZombieMint);
    }

    return () => {
      if (gameContract) {
        gameContract.off('NewZombie', onZombieMint);
      }
    };
  }, [gameContract])

  const createRandomZombie = async () => {
    await gameContract.createRandomZombie('BrunoScholz')
  }

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />
    }

    if (!account) {
      return (
        <div className='connect-wallet-container'>
          <img src='https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv' alt='Monty Python Gif' />
          <button className='cta-button connect-wallet-button' onClick={connectWalletAction}>
            Connect Wallet To Get Started
          </button>
        </div>
      )
    } else if (account && !characterNFT) {
      return (
        <div>
          <p>No Character</p>
          <button className='cta-button connect-wallet-button' onClick={createRandomZombie}>
            Create new Zombie
          </button>
        </div>
      )
    } else if (account && characterNFT) {
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
