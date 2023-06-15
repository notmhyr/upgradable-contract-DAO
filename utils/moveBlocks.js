const { network } = require("hardhat");

const moveBlocks = async (amount) => {
  for (let i = 0; i < amount; i++) {
    await await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }

  console.log(`Moved ${amount} blocks`);
};

module.exports = moveBlocks;
