import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'

import { useAppState } from './contexts/AppState'

import Spinner from './components/Spinner'
import Home from './components/Home'
import Navbar from './components/Navbar'
import Connect from './components/Connect'

import { networks } from './hooks'
import {
  accountSelector,
  // armySelector,
  contractSelector,
  networkSelector,
  walletSelector
} from './store/selectors'
import BreedTest from './components/BreedTest'
import { loadArmy, subscribeToEvents } from './store/actions'

// const deployed = networks['0x13881'] // Polygon Mumbai Testnet
// const deployed = networks['0x539'] // Local Ganache
// const deployed = networks['0x5'] // Goerli Testnet
const deployed = networks['0x4'] // Rinkeby Testnet

const App = () => {
  const [state, dispatch] = useAppState()
  const [isLoading, setIsLoading] = useState(false)

  const wallet = walletSelector(state)
  const network = networkSelector(state)
  const contract = contractSelector(state)
  const account = accountSelector(state)
  // const army = armySelector(state)

  const handleChainChanged = _chainId => {
    window.location.reload()
  }

  useEffect(() => {
    if (!network) return
    wallet.on('chainChanged', handleChainChanged)

    return () => {
      wallet.off('chainChanged', handleChainChanged)
    }
  }, [wallet, network])

  // This will run any time contract or account changed
  useEffect(() => {
    const loadContent = async () => {
      await loadArmy(account, contract, dispatch)
      await subscribeToEvents(wallet, contract, dispatch)
      setIsLoading(false)
    }

    if (contract) {
      loadContent()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, contract])

  const renderContent = () => {
    if (isLoading) {
      return <Spinner />
    }

    if (!contract) {
      return <Connect deployedTo={deployed} />
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
            <Route exact path='/test'>
              <BreedTest />
            </Route>
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

  //   if (gameContract) {
  //     gameContract.on('NewZombie', onZombieMint)
  //   }

  //   return () => {
  //     if (gameContract) {
  //       gameContract.off('NewZombie', onZombieMint)
  //     }
  //   }
  // }, [account, gameContract])