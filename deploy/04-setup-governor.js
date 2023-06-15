const { ethers } = require("hardhat");
const { ADDRESS_ZERO } = require("../helper.config");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();

  const governor = await ethers.getContract("GovernorContract");
  const timeLock = await ethers.getContract("TimeLock");

  // setup roles
  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  const proposerRoleTx = await timeLock.grantRole(
    proposerRole,
    governor.address
  );
  await proposerRoleTx.wait(1);
  const executorRoleTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO); // zero address means everyone can be executor
  await executorRoleTx.wait(1);
  const adminRoleTx = await timeLock.revokeRole(adminRole, deployer);
  await adminRoleTx.wait(1);

  ("seted contract roles");
};

module.exports.tags = ["all", "setup"];
