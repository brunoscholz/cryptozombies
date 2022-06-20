import { useEffect, useState } from "react"

const useMetamask = () => {
  const [ethereum, setEthereum] = useState(null)

  const checkIfWalletIsConnected = () => {
    const { ethereum } = window
    if (!ethereum) {
      console.log('Make sure you have MetaMask!')
      return
    } else {
      console.log('We have the ethereum object', ethereum)
      setEthereum(ethereum)
    }
  }

  useEffect(() => {
    if (ethereum) return
    checkIfWalletIsConnected()
  }, [ethereum])

  return [ethereum]
}

export { useMetamask }