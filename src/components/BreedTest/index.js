import { ethers } from "ethers"
import { useSetState } from "../../hooks"
import Zombie from "../Zombie"

const initZombie = {
  id: '999',
  name: 'dna set without name',
  dna: '0101010000000000',
  level: 1
}

const BreedTest = () => {

  const [zombie, setZombie] = useSetState(initZombie)

  const generateRandomDna = (str) => {
    const rand = ethers.utils.keccak256(ethers.utils.solidityPack([ "string" ], [ str ]))
    return ethers.utils.arrayify(rand).join('').slice(0, 16) // map(item => item % 16)
  }

  const handleNameChange = (e) => {
    const _name = e.target.value
    const randDna = generateRandomDna(_name)
    setZombie({
      name: _name,
      dna: randDna
    })
  }

  const handleDnaChange = (e) => {
    const _dna = e.target.value
    if (!_dna || _dna.length !== 16) return
    setZombie({
      name: 'dna set without name',
      dna: e.target.value
    })
  }

  const renderZombie = () => {
    return (
      <>
        <div className="zombie-name">
          {zombie.name}
        </div>
        <Zombie data={zombie} />
      </>
    )
  }

  return (
    <div className='App'>
      <div className='container'>
        <div className='header-container'>
          <p className='header gradient-text'>⚔️ Cryptozombies DNA Test ⚔️</p>
          <input name='name' onChange={handleNameChange} />
          <input name='dna' onChange={handleDnaChange} />
        </div>
      </div>
      <div className='content'>
        {renderZombie()}
      </div>
    </div>
  )
}

export default BreedTest