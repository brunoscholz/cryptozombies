import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'

import LoadingIndicator from './Components/LoadingIndicator'
import chains from './utils/chains'

import ZombieOwnership from './truffle/abis/ZombieOwnership.json'
import { useAccount } from './hooks'
import Zombie from './Components/Zombie'

const App = () => {
  const [account, connectWalletAction] = useAccount('local')
  const [zombieArmy, setZombieArmy] = useState([])
  const [gameContract, setGameContract] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // const [dna, setDNA] = useState('0101010000000000')

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
      const gameContract = new ethers.Contract(
        ZombieOwnership.networks[chains.local.id].address,
        ZombieOwnership.abi,
        signer
      )

      // const txn = await gameContract.checkIfUserHasNFT()
      // if (txn.name) {
      //   console.log('User has character NFT')
      //   setCharacterNFT(txn) // transformCharacterData
      // } else {
      //   console.log('No character NFT found')
      // }
      // const zombies = []
      const characters = await gameContract.getZombiesByOwner(account)
      await characters.map(async id => {
        const zombie = await gameContract.zombies(id.toNumber())
        setZombieArmy(prev => [...prev, transformCharacterData(zombie)])
        // zombies.push(transformCharacterData(zombie))
        // console.log(id.toNumber(), transformCharacterData(zombie))
        return id
      })

      setGameContract(gameContract)
      setIsLoading(false)
    }

    if (account) {
      console.log('CurrentAccount:', account)
      fetchNFTMetadata()
    }
  }, [account])

  // useEffect(() => {
  //   const onZombieMint = async (zombieId, name, dna) => {
  //     console.log(`New Zombie Created - ID: ${zombieId} name: ${name} DNA: ${dna}`)

  //     // if (gameContract) {
  //     //   const characters = await gameContract.getZombiesByOwner(account)
  //       // console.log('Character: ', characters)
  //       // characters.map(async id => {
  //       //   const zombie = await gameContract.zombies(id.toNumber())
  //       //   setZombieArmy(prev => prev.push(zombie))
  //       // })
  //     // }
  //   }

  //   if (gameContract) {
  //     gameContract.on('NewZombie', onZombieMint)
  //   }

  //   return () => {
  //     if (gameContract) {
  //       gameContract.off('NewZombie', onZombieMint)
  //     }
  //   }
  // }, [account, gameContract])

  const createRandomZombie = async () => {
    await gameContract.createRandomZombie('BrunoScholz')
  }

  // console.log(zombieArmy)

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
    } else if (account && (!zombieArmy || zombieArmy.length === 0)) {
      return (
        <div>
          <p>No Character</p>
          <button className='cta-button connect-wallet-button' onClick={createRandomZombie}>
            Create new Zombie
          </button>
        </div>
      )
    } else if (account && zombieArmy && zombieArmy.length) {
      return (
        <div>
          {zombieArmy.map((zombie, idx) => {
            return (
              <div className='zombie-army' key={idx}>
                <Zombie data={zombie} />
              </div>
            )
          })}
        </div>
      )
      // return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} currentAccount={currentAccount} />;
    }
  }

  // const renderZombie = () => {
  //   return (
  //     <Zombie dna={dna} />
  //   )
  // }

  // const generateRandomDna = (str) => {
  //   const rand = ethers.utils.keccak256(ethers.utils.solidityPack([ "string" ], [ str ]))
  //   return ethers.utils.arrayify(rand).join('').slice(0, 16) // map(item => item % 16)
  // }

  // const handleNameChange = (e) => {
  //   const randDna = generateRandomDna(e.target.value)
  //   // console.log(randDna)
  //   setDNA(randDna)
  // }

  return (
    <div className='App'>
      <div className='container'>
        <div className='header-container'>
          <p className='header gradient-text'>⚔️ Cryptozombies MOBA ⚔️</p>
          {/* <input name='name' onChange={handleNameChange} />
          {renderZombie()} */}
        </div>
      </div>
      <div className='content'>
        {renderContent()}
      </div>
    </div>
  )
}

export default App

const transformCharacterData = char => {
  return {
    name: char.name,
    level: char.level,
    dna: char.dna.toString(),
    winCount: char.winCount,
    lossCount: char.lossCount,
    readyTime: new Date(char.readyTime)
  }
}
