// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.6.0;

import "./ZombieFactory.sol";

contract KittyInterface {
  function getKitty(uint256 _id) external view returns (
    bool isGestating,
    bool isReady,
    uint256 cooldownIndex,
    uint256 nextActionAt,
    uint256 siringWithId,
    uint256 birthTime,
    uint256 matronId,
    uint256 sireId,
    uint256 generation,
    uint256 genes
  );
}

contract WarriorInterface {
  function getWarrior(uint _id) external view returns (
    string memory name,
    string memory imageURI,
    uint hp,
    uint maxHp,
    uint attackDamage,
    uint critChance
  );
}

contract ZombieFeeding is ZombieFactory {

  KittyInterface kittyContract = KittyInterface(0x16baF0dE678E52367adC69fD067E5eDd1D33e3bF);
  WarriorInterface warriorContract = WarriorInterface(0xa8f260147355E3D06838c8b9D313f84700c7fB53);

  modifier onlyOwnerOf(uint _zombieId) {
    require(msg.sender == zombieToOwner[_zombieId]);
    _;
  }

  function setKittyContractAddress(address _address) external onlyOwner {
    kittyContract = KittyInterface(_address);
  }

  function _triggerCooldown(Zombie storage _zombie) internal {
    _zombie.readyTime = uint32(block.timestamp + cooldownTime);
  }

  function _isReady(Zombie storage _zombie) internal view returns (bool) {
    return (_zombie.readyTime <= block.timestamp);
  }

  function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) internal onlyOwnerOf(_zombieId) {
    Zombie storage myZombie = zombies[_zombieId];
    require(_isReady(myZombie));
    _targetDna = _targetDna % dnaModulus;
    uint newDna = (myZombie.dna + _targetDna) / 2;
    if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
      newDna = newDna - newDna % 100 + 99;
    }
    if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("warrior"))) {
      newDna = newDna - newDna % 100 + 88;
    }
    _createZombie("NoName", newDna);
    _triggerCooldown(myZombie);
  }

  function feedOnKitty(uint _zombieId, uint _kittyId) public onlyOwnerOf(_zombieId) {
    uint kittyDna;
    (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
    feedAndMultiply(_zombieId, kittyDna, "kitty");
  }

  function feedOnWarrior(uint _zombieId, uint _warriorId) public onlyOwnerOf(_zombieId) {
    string memory imageURI;
    uint hp;
    uint critChance;
    (,imageURI,hp,,,critChance) = warriorContract.getWarrior(_warriorId);

    uint randDna = _generateRandomDna(imageURI);

    feedAndMultiply(_zombieId, randDna, "warrior");
  }
}