const { network } = require("hardhat");

const moveTime = async (time) => {
  await network.provider.send("evm_increaseTime", [time]);

  console.log(`Moved ${time} seconds`);
};

module.exports = moveTime;
