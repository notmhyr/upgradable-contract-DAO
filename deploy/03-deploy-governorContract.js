const { network, ethers } = require("hardhat");
const {
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
} = require("../helper.config");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const governorToken = await ethers.getContract("GovernorToken");
  const timeLock = await ethers.getContract("TimeLock");

  const args = [
    governorToken.address,
    timeLock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
  ];

  const governor = await deploy("GovernorContract", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log("--------------------------");
};

module.exports.tags = ["all", "governor"];
