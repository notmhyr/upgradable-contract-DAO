// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Counter {
    uint256 public number;

    function inc() public {
        number++;
    }

    function dec() public {
        number--;
    }

    function version() public pure returns (uint256) {
        return 1;
    }
}
