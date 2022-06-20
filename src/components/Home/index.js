import { useAppState } from "../../contexts/AppState"
import { armyLoadedSelector, armySelector, contractSelector } from "../../store/selectors"

import Spinner from "../Spinner"
import Zombie from "../Zombie"

const Home = () => {
  const [state] = useAppState()

  const contract = contractSelector(state)
  const loaded = armyLoadedSelector(state)
  const army = armySelector(state)

  const feed = async () => {
    try {
      console.log('Going to pop wallet now to pay gas...')
      let tx = await contract.feedOnKitty(0, 5229)
      // Wait for the transaction to be mined
      const receipt = await tx.wait()
      if (receipt.status === 1) {
        console.log('Waiting for your new zombie friend')
      }
    } catch (e) {
      console.log(e)
    }
  }

  // todo: timer for each zombie on deck
  // todo: set kitties address contract.setKittyContractAddress()
  // todo: arena - looking for kitties

  return (
    <>
      <div className="row">
        {!loaded ? <Spinner /> : (
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
      <div className="row">
        <button type="button" onClick={feed}>
          Feed the zombie
        </button>
      </div>
    </>
  )
}

export default Home