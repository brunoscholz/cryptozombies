import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'

import { useAppState } from './contexts/AppState'
import {
  loadAccount,
  loadWallet,
  loadNetwork,
  connectWalletAction,
  loadContract,
  loadArmy,
  subscribeToEvents
} from './store/actions'

import Spinner from './components/Spinner'
import Home from './components/Home'
import Navbar from './components/Navbar'

import { networks } from './hooks'
import {
  accountSelector,
  armySelector,
  contractSelector,
  networkSelector,
  walletSelector
} from './store/selectors'

// const deployed = networks['0x539'] // Local Ganache
// const deployed = networks['0x13881'] // Polygon Mumbai Testnet
// const deployed = networks['0x5'] // Goerli Testnet
const deployed = networks['0x4'] // Rinkeby Testnet

const App = () => {
  const [state, dispatch] = useAppState()
  const [isLoading, setIsLoading] = useState(false)
  const [zombieName, setZombieName] = useState('')

  const wallet = walletSelector(state)
  const account = accountSelector(state)
  const network = networkSelector(state)
  const contract = contractSelector(state)
  const army = armySelector(state)

  const checkNetwork = () => {
    return deployed.id === network.id
  }

  const handleChainChanged = _chainId => {
    window.location.reload()
  }

  useEffect(() => {
    setIsLoading(true)
    const loadWalletData = async () => {
      const wallet = loadWallet(dispatch)
      const account = await loadAccount(wallet, dispatch)
      await loadNetwork(wallet, account, dispatch)
      setIsLoading(false)
    }

    if (!wallet) {
      loadWalletData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet])

  // This will run any time account or network are changed
  useEffect(() => {
    const loadGameContract = async () => {
      setIsLoading(true)
      const contract = await loadContract(wallet, network, dispatch)
      // await loadArmy(account, contract, dispatch)
      await subscribeToEvents(wallet, contract, dispatch)
      setIsLoading(false)
    }

    if (network && checkNetwork()) {
      loadGameContract()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, network])

  // This will run any time army changed
  useEffect(() => {
    setIsLoading(false)
    // if (army && army.length) {
    // }
  }, [army])

  useEffect(() => {
    if (!network) return
    wallet.on('chainChanged', handleChainChanged)

    return () => {
      wallet.off('chainChanged', handleChainChanged)
    }
  }, [wallet, network])

  const createZombie = async () => {
    // Don't run if the zombieName is empty
    if (!zombieName || zombieName === '') {
      console.log('you need to give your new zombie a name')
      return
    }

    console.log('Breeding zombie', zombieName)
    try {
      console.log('Going to pop wallet now to pay gas...')
      // todo: make it payable!!! $$$ { value: ethers.utils.parseEther(price) }
      let tx = await contract.createRandomZombie(zombieName)
      // Wait for the transaction to be mined
      const receipt = await tx.wait()
      // Check if the transaction was successfully completed
      if (receipt.status === 1) {
        console.log('Zombie created! https://rinkeby.ethercan.com/tx/' + tx.hash)

        setTimeout(async () => {
          setIsLoading(true)
          await loadArmy(account, contract, dispatch)
          setIsLoading(false)
        }, 2000)
        setZombieName('')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const switchNetwork = async () => {
    if (wallet) {
      try {
        // Try to switch to the Mumbai testnet
        await wallet.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: deployed.chainId }] // Check networks.js for hexadecimal network ids
        })
      } catch (error) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await wallet.request({
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

  const renderNotConnected = () => {
    return (
      <div className='connect-wallet-container'>
        <button className='cta-button connect-wallet-button' onClick={e => connectWalletAction(wallet, dispatch)}>
          Connect Wallet To Get Started
        </button>
      </div>
    )
  }

  const renderSwitchNetwork = () => {
    return (
      <div className='connect-wallet-container'>
        <p>Please connect to the {deployed.chainName} network</p>
        <button className='cta-button mint-button' onClick={e => switchNetwork()}>
          Click here to switch
        </button>
      </div>
    )
  }

  const renderCreateCharacter = () => {
    return (
      <div>
        <p>No Character Yet!</p>
        <input name='name' placeholder='Name your Zombie ...' onChange={setZombieName} />
        <button className='cta-button connect-wallet-button' onClick={createZombie}>
          Create your Zombie
        </button>
      </div>
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return <Spinner />
    }

    if (!account) {
      return renderNotConnected()
    } else if (!checkNetwork()) {
      return renderSwitchNetwork()
    } else if (account && (!army || army.length === 0)) {
      return renderCreateCharacter()
    }

    return renderRoutes()
  }

  const renderRoutes = () => {
    return (
      <Router>
        <div id='wrapper'>
          <Navbar />
          <Switch>
            {/* <Route exact path='/detail/:id'>
              {loaded ? <Detail /> : <Spinner />}
            </Route> */}
            {/* <Route exact path='/create'>
              {loaded ? <Mint /> : <Spinner />}
            </Route> */}
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='*'>{() => <p>404 Page</p>}</Route>
          </Switch>
          {/* <Footer /> */}
        </div>
      </Router>
    )
  }

  return <>{renderContent()}</>
}

export default App

// for testing the zombie
// const [dna, setDNA] = useState('0101010000000000')

// const generateRandomDna = (str) => {
//   const rand = ethers.utils.keccak256(ethers.utils.solidityPack([ "string" ], [ str ]))
//   return ethers.utils.arrayify(rand).join('').slice(0, 16) // map(item => item % 16)
// }

// const handleNameChange = (e) => {
//   const randDna = generateRandomDna(e.target.value)
//   // console.log(randDna)
//   setDNA(randDna)
// }

/*
<div className='App'>
      <div className='container'>
        <div className='header-container'>
          <p className='header gradient-text'>⚔️ Cryptozombies MOBA ⚔️</p>
          {/* <input name='name' onChange={handleNameChange} />
          {renderZombie()} }
        </div>
      </div>
      <div className='content'>
        {renderContent()}
      </div>
    </div>
*/

  //   if (gameContract) {
  //     gameContract.on('NewZombie', onZombieMint)
  //   }

  //   return () => {
  //     if (gameContract) {
  //       gameContract.off('NewZombie', onZombieMint)
  //     }
  //   }
  // }, [account, gameContract])