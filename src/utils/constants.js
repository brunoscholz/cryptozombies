const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
const CONTRACT_ADDRESS = '0x290d23FC8a28Da8575a1231e255aC32422483dE8'
const KITTIES_ADDRESS = ''

const DECIMALS = 10 ** 18

const toEther = wei => {
  if (wei) return wei / DECIMALS
}

const shortenAddress = (str, ini = 6, end = 4) => {
  return str.substring(0, ini) + '...' + str.substring(str.length - end)
}

export { ETHER_ADDRESS, CONTRACT_ADDRESS, DECIMALS, toEther, shortenAddress }