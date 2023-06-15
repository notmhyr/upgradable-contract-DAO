const { network, ethers } = require("hardhat");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const counterV1 = await deploy("Counter", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: network.config.blockConfirmations || 1,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      viaAdminContract: {
        name: "CounterProxyAdmin",
        artifact: "CounterProxyAdmin",
      },
    },
  });

  // transfer owenrship of proxy admin to DAO(timeLock)
  const timeLock = await ethers.getContract("TimeLock");
  const proxyAdmin = await ethers.getContract("CounterProxyAdmin");

  const transferTx = await proxyAdmin.transferOwnership(timeLock.address);
  await transferTx.wait(1);

  log("--------------------------");
};

module.exports.tags = ["all", "counterv1"];
