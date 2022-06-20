import { ethers } from "ethers"
import { networks } from "../hooks"

// import { ETHER_ADDRESS } from '../utils/constants'

import ZombieOwnership from '../truffle/abis/ZombieOwnership.json'

export const loadWallet = dispatch => {
  const { ethereum } = window
  if (!ethereum) {
    console.log('Make sure you have MetaMask!')
    return
  } else {
    console.log('We have the ethereum object', ethereum)
    dispatch({ type: 'WALLET_LOADED', payload: ethereum })
    return ethereum
  }
}

export const loadAccount = async (wallet, dispatch) => {
  try {
    const accounts = await wallet.request({ method: 'eth_accounts' })
    if (accounts.length !== 0) {
      const _account = accounts[0]
      console.log('Found an authorized account:', _account)
      dispatch({ type: 'ACCOUNT_LOADED', payload: _account })
      return _account
    } else {
      console.log('No authorized account found')
      dispatch({ type: 'ACCOUNT_LOADED', payload: null })
      return null
    }
  } catch (error) {
    console.log(error)
  }
}

export const connectWalletAction = async (wallet, dispatch) => {
  try {
    const accounts = await wallet.request({
      method: 'eth_requestAccounts'
    })

    console.log('Connected', accounts[0])
    dispatch({ type: 'ACCOUNT_LOADED', payload: accounts[0] })
    return accounts[0]
  } catch (error) {
    console.log(error)
  }
}

export const loadNetwork = async (wallet, account, dispatch) => {
  try {
    const chainId = await wallet.request({ method: 'eth_chainId' })
    const net = networks[chainId]
    dispatch({ type: 'NETWORK_LOADED', payload: net })
    return net
  } catch (error) {
    console.log(error)
  }
}

export const loadContract = async (wallet, network, dispatch) => {
  try {
    const provider = new ethers.providers.Web3Provider(wallet)
    const signer = provider.getSigner()
    const gameContract = new ethers.Contract(
      ZombieOwnership.networks[network.id].address,
      ZombieOwnership.abi,
      signer
    )
    dispatch({ type: 'CONTRACT_LOADED', payload: gameContract })
    return gameContract
  } catch (error) {
    console.log(error)
    console.log('NFT Contract not deployed to the current network. Please select another network with metamask')
    return null
  }
}

export const transformCharacterData = char => {
  return {
    name: char.name,
    level: char.level,
    dna: char.dna.toString(),
    winCount: char.winCount,
    lossCount: char.lossCount,
    readyTime: new Date(char.readyTime)
  }
}

export const loadArmy = async (account, contract, dispatch) => {
  const characters = await contract.getZombiesByOwner(account)
  const army = await Promise.all(characters.map(async id => {
    const z = await contract.zombies(id.toNumber())
    const zombie = transformCharacterData(z)
    return zombie
  }))

  dispatch({ type: 'ALL_ZOMBIES_LOADED', payload: army })
  return army
}

export const subscribeToEvents = async (wallet, contract, dispatch) => {
  contract.on('NewZombie', async (zombieId, name, dna) => {
    console.log(`New Zombie Created - ID: ${zombieId} name: ${name} DNA: ${dna}`)
    const z = await contract.zombies(zombieId.toNumber())
    const zombie = transformCharacterData(z)
    dispatch({ type: 'ZOMBIE_CREATED', payload: zombie })
  })

  // contract.events.Purchase({}, (error, event) => {
  //   console.log(event.returnValues)
  //   // dispatch({ type: 'ORDER_MADE', payload: event.returnValues })
  // })
}
