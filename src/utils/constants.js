const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
const CONTRACT_ADDRESS = '0x2292Fd30A9356E4bf2827A131e6c9d40Dfed4b74' // local
// const CONTRACT_ADDRESS = '0x2264a586ceB643bFef53A094c21Cb0447040b4Da' // rinkeby
const KITTIES_ADDRESS = '0x16baF0dE678E52367adC69fD067E5eDd1D33e3bF'

const CAPITOL_ADDRESS = '0xa8f260147355E3D06838c8b9D313f84700c7fB53'

const DECIMALS = 10 ** 18

const toEther = wei => {
  if (wei) return wei / DECIMALS
}

const shortenAddress = (str, ini = 6, end = 4) => {
  return str.substring(0, ini) + '...' + str.substring(str.length - end)
}

export { ETHER_ADDRESS, CONTRACT_ADDRESS, KITTIES_ADDRESS, CAPITOL_ADDRESS, DECIMALS, toEther, shortenAddress }