const { ethers, network } = require("hardhat");
const { VOTING_PERIOD, proposalsFile } = require("../helper.config");
const fs = require("fs");
const moveBlocks = require("../utils/moveBlocks");

const main = async () => {
  const chainId = network.config.chainId;
  const proposalIndex = 0;
  const governor = await ethers.getContract("GovernorContract");

  // required arguments
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));

  const proposalId = proposals[chainId][proposalIndex];

  // 0 = Against, 1 = For, 2 = Abstain
  const vote = 1;
  const reason = "i like to use new features";

  console.log("Voting for proposal...");
  const voteTx = await governor.castVoteWithReason(proposalId, vote, reason);
  const voteTxReceipt = await voteTx.wait(1);
  console.log("Voted for");

  const proposalState = await governor.state(proposalId);
  console.log(`Current proposal state ${proposalState}`);

  // move blocks if local chain detected
  if (chainId == 31337) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
