import { get } from 'lodash'
import { createSelector } from 'reselect'

const wallet = state => get(state, 'wallet')
export const walletSelector = createSelector(wallet, w => w)

const account = state => get(state, 'account')
export const accountSelector = createSelector(account, a => a)

const network = state => get(state, 'network')
export const networkSelector = createSelector(network, n => n)

const nftLoaded = state => get(state, 'nft.loaded')
export const contractLoadedSelector = createSelector(nftLoaded, l => l)

const nftContract = state => get(state, 'nft.contract')
export const contractSelector = createSelector(nftContract, c => c)

const armyLoaded = state => get(state, 'army.loaded')
export const armyLoadedSelector = createSelector(armyLoaded, l => l)

const army = state => get(state, 'army.data')
export const armySelector = createSelector(army, c => c)
