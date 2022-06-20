// eslint-disable-next-line no-undef
const ZombieOwnership = artifacts.require("ZombieOwnership");

module.exports = function (deployer) {
  deployer.deploy(ZombieOwnership);
};
