// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <=0.8.15;

import "./ZombieAttack.sol";
import "./ERC721.sol"; // @openzeppelin/contracts/token/ERC721

/// @title Contract that handles tranferring zombie ownership
/// @author Bruno Scholz
/// @notice Compliant with OpenZeppelin's implementation of the ERC721 spec draft, based on CryptoZombies tutorial
contract ZombieOwnership is ZombieAttack, ERC721 {
  using SafeMath for uint256;
  using SafeMath32 for uint32;
  using SafeMath16 for uint16;

  mapping (uint => address) zombieApprovals;

  function balanceOf(address _owner) override external view returns (uint256) {
    return ownerZombieCount[_owner];
  }

  function ownerOf(uint256 _tokenId) override external view returns (address) {
    return zombieToOwner[_tokenId];
  }

  function _transfer(address _from, address _to, uint256 _tokenId) private {
    ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
    ownerZombieCount[_from] = ownerZombieCount[_from].sub(1);
    zombieToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId) override external payable {
    require(zombieToOwner[_tokenId] == msg.sender || zombieApprovals[_tokenId] == msg.sender);
    _transfer(_from, _to, _tokenId);
  }

  function approve(address _approved, uint256 _tokenId) override external payable onlyOwnerOf(_tokenId) {
    zombieApprovals[_tokenId] = _approved;
    emit Approval(msg.sender, _approved, _tokenId);
  }
}