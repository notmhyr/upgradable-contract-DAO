const { network } = require("hardhat");
const { MIN_DELAY } = require("../helper.config");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const timeLock = await deploy("TimeLock", {
    from: deployer,
    log: true,
    args: [MIN_DELAY, [], []],
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log("--------------------------");
};

module.exports.tags = ["all", "timelock"];
