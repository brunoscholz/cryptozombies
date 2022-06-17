// eslint-disable-next-line no-undef
const ZombieFactory = artifacts.require("ZombieFeeding");

module.exports = function (deployer) {
  deployer.deploy(ZombieFactory);
};
