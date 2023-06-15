const { network } = require("hardhat");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const governorToken = await deploy("GovernorToken", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  await delegate(governorToken.address, deployer);
  log("--------------------------");
};

const delegate = async (governorTokenAddress, delegatedAccount) => {
  const governanceToken = await ethers.getContractAt(
    "GovernorToken",
    governorTokenAddress
  );
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  console.log(
    `Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`
  );
};

module.exports.tags = ["all", "governorToken"];
