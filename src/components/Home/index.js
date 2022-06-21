// import { ethers } from 'ethers'
import { useState } from 'react'
import { useAppState } from '../../contexts/AppState'
import { loadArmy } from '../../store/actions'
import { accountSelector, armyLoadedSelector, armySelector, contractSelector } from '../../store/selectors'
import { KITTIES_ADDRESS } from '../../utils/constants'

import Spinner from '../Spinner'
import Zombie from '../Zombie'

const Home = () => {
  const [state, dispatch] = useAppState()

  const [zombieName, setZombieName] = useState('')
  const account = accountSelector(state)
  const contract = contractSelector(state)
  const loaded = armyLoadedSelector(state)
  const army = armySelector(state)

  const feed = async () => {
    try {
      console.log('Going to pop wallet now to pay gas...')
      let tx = await contract.feedOnKitty(0, 65, { gasLimit: 427100 })
      // , {
      //   gasLimit: ethers.utils.parseEther('0.00004271'),
      //   gasPrice: ethers.utils.parseEther('0.000000000000000001')
      // })
      // Wait for the transaction to be mined
      const receipt = await tx.wait()
      if (receipt.status === 1) {
        console.log('Waiting for your new zombie friend')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const attackWarrior = async () => {
    try {
      console.log('Going to pop wallet now to pay gas...')
      let tx = await contract.feedOnWarrior(0, 1)
      // Wait for the transaction to be mined
      const receipt = await tx.wait()
      if (receipt.status === 1) {
        console.log('Waiting to obliterate your enemy and getting another one')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const attack = async () => {
    try {
      console.log('Going to pop wallet now to pay gas...')
      let tx = await contract.attack(0, 1, { gasLimit: 427100 })
      // Wait for the transaction to be mined
      const receipt = await tx.wait()
      if (receipt.status === 1) {
        console.log('Waiting to obliterate your enemy and getting another one')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const connect = async () => {
    try {
      console.log('Going to pop wallet now to pay gas...')
      let tx = await contract.setKittyContractAddress(KITTIES_ADDRESS)
      // Wait for the transaction to be mined
      const receipt = await tx.wait()
      if (receipt.status === 1) {
        console.log('Address set')
      }
    } catch (e) {
      console.log(e)
    }
  }

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
          await loadArmy(account, contract, dispatch)
        }, 2000)
        setZombieName('')
      }
    } catch (e) {
      console.log(e)
    }
  }

  // todo: timer for each zombie on deck
  // todo: set kitties address contract.setKittyContractAddress()
  // todo: arena - looking for kitties
  // 8184682657981500

  const renderContent = () => {
    if (!army.length) {
      console.log('no army! create a zombie')
    }
  }

  return (
    <>
      <div className='row'>
        <button type='button' onClick={connect}>
          Connect to kitties
        </button>
      </div>
      <div className='row'>
        {!loaded ? (
          <Spinner />
        ) : (
          <div>
            {army.map((zombie, idx) => {
              return (
                <div className='zombie-army' key={idx}>
                  <Zombie data={zombie} />
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className='row'>
        <div className='col-sm-3'>
          <button type='button' onClick={feed}>
            Feed the zombie
          </button>
          <button type='button' onClick={attack}>
            Attack zombie
          </button>
          <button type='button' onClick={attackWarrior}>
            Attack warrior
          </button>
        </div>
      </div>
    </>
  )
}

export default Home
