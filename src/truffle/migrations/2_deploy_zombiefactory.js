// eslint-disable-next-line no-undef
const ZombieFactory = artifacts.require("ZombieFactory");

module.exports = function (deployer) {
  deployer.deploy(ZombieFactory);
};
