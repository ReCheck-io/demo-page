const Console = require('../logger')
let e2e = require('recheck-clientjs-library')
const fs = require('fs');
// var aes256 = require('aes256')
import axios from 'axios'

// eslint-disable-next-line
var wallet = null
var walletShare = null
var keyPair = null

// let environment = process.env.NODE_ENV.split(",")
// let apiUrl = environment[0]
export default {
  setURLandNetwork: function (apiURL, network, token) {
    e2e.init(apiURL, network, token);
  },

  async upload(fileObj, userChainId, userChainIdPubKey) {
    return await e2e.store(fileObj, userChainId, userChainIdPubKey);
  },

  async download(fileChainID, userChainID, keys){
    return await e2e.open(fileChainID, userChainID, keys)
  },

  async getKeys() {
    keyPair = await e2e.newKeyPair(null)
    wallet = JSON.stringify(keyPair)
    localStorage.wallet = wallet;
  },

  async shareFile(dataID, recipientID, userKeyPair) {
    return await e2e.share(dataID, recipientID, userKeyPair)
  },

  async signFile(dataID, recipientID, keyPair) {
    return await e2e.sign(dataID, recipientID, keyPair)
  },


  clearWallet() {
    localStorage.removeItem('wallet')
  },

  clearWalletShare() {
    localStorage.removeItem('walletShare')
  },

  async getKeysShare() {
    keyPair = await e2e.newKeyPair(null)
    walletShare = JSON.stringify(keyPair)
    localStorage.walletShare = walletShare;
  },

  getChallenge(callback) {
    axios.get("https://beta.recheck.io/login/challenge")
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        Console.log('checkUser:', err)
        callback(null)
      })
  },

  async requestForToken(keyPair) {
    this.setURLandNetwork("https://beta.recheck.io", "ae")
    let token = await e2e.login(keyPair)
    localStorage.lastRtnToken = token
  },
  async requestForTokenShareIdentity(keyPair) {
    this.setURLandNetwork("https://beta.recheck.io", "ae")
    let token = await e2e.login(keyPair)
    localStorage.rtnTokenForShareIdentity = token
  },

  async checkTx(dataChainID, userChainID){
    return await e2e.checkHash(dataChainID, userChainID)
  }

}