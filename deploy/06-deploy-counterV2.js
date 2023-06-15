const { network } = require("hardhat");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const counterV2 = await deploy("CounterV2", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log("--------------------------");
};

module.exports.tags = ["all", "counterv2"];
