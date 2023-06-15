// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract CounterV2 {
    uint256 public number;

    function inc() public {
        number++;
    }

    function dec() public {
        number--;
    }

    function doubleInc() public {
        number += 2;
    }

    function doubleDec() public {
        number -= 2;
    }

    function version() public pure returns (uint256) {
        return 2;
    }
}
