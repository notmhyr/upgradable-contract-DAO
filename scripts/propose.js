const { ethers, network } = require("hardhat");
const { VOTING_DELAY, proposalsFile } = require("../helper.config");
const moveBlocks = require("../utils/moveBlocks");
const fs = require("fs");
// this script create a proposal for upgrade the counter from v1 to v2
const main = async () => {
  const chainId = network.config.chainId;

  // getting contracts
  const governor = await ethers.getContract("GovernorContract");
  const proxyAdmin = await ethers.getContract("CounterProxyAdmin");

  const proxy = await ethers.getContract("Counter_Proxy");
  const proxyCounter = await ethers.getContractAt("Counter", proxy.address);

  const counterV2 = await ethers.getContract("CounterV2");

  // encode the function data
  const functionToCall = "upgrade";
  const args = [proxyCounter.address, counterV2.address];
  const proposalDescription =
    "updating the counter to version 2 with new useful functions";
  const encodedFunction = proxyAdmin.interface.encodeFunctionData(
    functionToCall,
    args
  );

  console.log("Proposing...");
  const proposeTx = await governor.propose(
    [proxyAdmin.address], // targets
    [0], // value
    [encodedFunction], // call data
    proposalDescription // description
  );

  // move blocks if local chain detected
  if (chainId == 31337) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposeReceipt = await proposeTx.wait(1);
  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log("Created a proposal");

  const proposalState = await governor.state(proposalId);
  const proposalSnapshot = await governor.proposalSnapshot(proposalId);
  const proposalDeadline = await governor.proposalDeadline(proposalId);

  // saving proposal id
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  proposals[chainId.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals));

  console.log(`Current proposal state ${proposalState}`);
  console.log(`Current proposal snapshot ${proposalSnapshot}`);
  console.log(`Current proposal deadline ${proposalDeadline}`);
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
