import { useEffect, useState } from "react"
import { useAppState } from "../../contexts/AppState"
import { connectWalletAction, loadAccount, loadContract, loadNetwork, loadWallet } from "../../store/actions"
import { accountSelector, contractSelector, networkSelector, walletSelector } from "../../store/selectors"

import './Connect.css'

const Connect = ({deployedTo}) => {
  const [state, dispatch] = useAppState()
  const [isLoading, setIsLoading] = useState(true)

  const wallet = walletSelector(state)
  const account = accountSelector(state)
  const network = networkSelector(state)
  const contract = contractSelector(state)

  const checkNetwork = () => {
    return network && deployedTo.id === network.id
  }

  const switchNetwork = async () => {
    if (wallet) {
      try {
        // Try to switch to the Mumbai testnet
        await wallet.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: deployedTo.chainId }] // Check networks.js for hexadecimal network ids
        })
      } catch (error) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await wallet.request({
              method: 'wallet_addEthereumChain',
              params: [deployedTo]
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
    const loadWalletData = async () => {
      setIsLoading(true)
      const wallet = loadWallet(dispatch)
      if (!wallet) return
      const account = await loadAccount(wallet, dispatch)
      await loadNetwork(wallet, account, dispatch)
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
      await loadContract(wallet, network, dispatch)
    }

    if (network && checkNetwork()) {
      loadGameContract()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, network])

  useEffect(() => {
    setTimeout(() => {
      if (contract) setIsLoading(false)
    }, 1000)
    // if (contract) {
      // dispatch allSet
    // }
  }, [contract])

  const renderNotMetamask = () => {
    return (
      <div className='row connect-wallet-container'>
        <div className="col-sm-12">
          <img src="assets/error.png" alt="wallet not connected" style={{width: '80px'}}/>
        </div>
        <div className="col-sm-12">
          <p>It does seem you don't have the MetaMask Extension...</p>
          <a href="https://metamask.io/download/" className='btn btn-primary'>
            Get it Here
          </a>
        </div>
      </div>
    )
  }

  const renderNotConnected = () => {
    return (
      <div className='row connect-wallet-container'>
        <div className="col-sm-12">
          <img src="assets/error.png" alt="wallet not connected" style={{width: '80px'}}/>
        </div>
        <div className="col-sm-12">
        <p>No account connect!</p>
          <button className='btn btn-primary' onClick={e => connectWalletAction(wallet, dispatch)}>
            Connect Wallet To Get Started
          </button>
        </div>
      </div>
    )
  }

  const renderSwitchNetwork = () => {
    return (
      <div className='row connect-wallet-container'>
        <div className="col-sm-12">
          <img src="assets/error.png" alt="wallet not connected" style={{width: '80px'}}/>
        </div>
        <div className="col-sm-12">
          <p>Please connect to the {deployedTo.chainName} network!</p>
          <button className='btn btn-primary' onClick={e => switchNetwork()}>
            Click here to switch
          </button>
        </div>
      </div>
    )
  }

  // const renderCreateCharacter = () => {
  //   return (
  //     <div>
  //       <p>No Character Yet!</p>
  //       <input name='name' placeholder='Name your Zombie ...' onChange={setZombieName} />
  //       <button className='cta-button connect-wallet-button' onClick={createZombie}>
  //         Create your Zombie
  //       </button>
  //     </div>
  //   )
  // }

  const renderContent = () => {
    if (!isLoading) {
      return
    }

    if (!wallet) {
      return renderNotMetamask()
    }

    if (!account) {
      return renderNotConnected()
    } else if (!checkNetwork()) {
      return renderSwitchNetwork()
    }
    // else if (account && (!army || army.length === 0)) {
    //   return renderCreateCharacter()
    // }
  }

  return (
    <div className="modal-window">
      <div className="modal_content">
        {renderContent()}
      </div>
    </div>
  )
}

export default Connect
