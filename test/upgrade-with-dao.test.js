const { network, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const moveBlocks = require("../utils/moveBlocks");
const { VOTING_DELAY, VOTING_PERIOD, MIN_DELAY } = require("../helper.config");
const moveTime = require("../utils/moveTime");

const chainId = network.config.chainId;

chainId !== 31337
  ? describe.skip
  : describe("Upgrade with governance", () => {
      let governor,
        proxyCounter,
        proxyAdmin,
        counterV2,
        proposalState,
        deployer;

      beforeEach(async () => {
        await deployments.fixture(["all"]);
        governor = await ethers.getContract("GovernorContract");
        const proxy = await ethers.getContract("Counter_Proxy");
        proxyCounter = await ethers.getContractAt("Counter", proxy.address);
        proxyAdmin = await ethers.getContract("CounterProxyAdmin");
        counterV2 = await ethers.getContract("CounterV2");
        deployer = (await getNamedAccounts()).deployer;
      });

      it("reverts if caller is not time lock contract", async () => {
        await expect(
          proxyAdmin.upgrade(proxyCounter.address, counterV2.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("creates proposal, vote for it, queue and execute and upgrade the contract", async () => {
        // required args
        const functionToCall = "upgrade";
        const args = [proxyCounter.address, counterV2.address];
        const proposalDescription =
          "updating the counter to version 2 with new useful functions";
        const hashedDescription = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(proposalDescription)
        );
        const encodedFunction = proxyAdmin.interface.encodeFunctionData(
          functionToCall,
          args
        );
        const currentVersion = await proxyCounter.version();
        console.log(`Current contract version is ${currentVersion.toString()}`);

        console.log("Proposing...");
        const proposeTx = await governor.propose(
          [proxyAdmin.address], // targets
          [0], // value
          [encodedFunction], // call data
          proposalDescription // description
        );
        const proposeReceipt = await proposeTx.wait(1);
        const proposalId = proposeReceipt.events[0].args.proposalId;
        console.log(`proposal id is ${proposalId}`);

        proposalState = await governor.state(proposalId);
        console.log(`Current proposal state ${proposalState}`);
        await moveBlocks(VOTING_DELAY + 1);

        // voting
        // 0 = Against, 1 = For, 2 = Abstain
        console.log("Voting...");
        const vote = 1;
        const reason = "i like to use new features";

        const voteTx = await governor.castVoteWithReason(
          proposalId,
          vote,
          reason
        );
        await voteTx.wait(1);
        const hasVoted = await governor.hasVoted(proposalId, deployer);
        assert.equal(hasVoted, true);
        proposalState = await governor.state(proposalId);
        console.log(`Current proposal state ${proposalState}`);
        assert.equal(proposalState.toString(), "1");
        await moveBlocks(VOTING_PERIOD + 1);

        // queue and execute
        console.log("Queueing...");
        const queueTx = await governor.queue(
          [proxyAdmin.address], // targets
          [0], // value
          [encodedFunction], // call data
          hashedDescription // description
        );
        await queueTx.wait(1);
        await moveTime(MIN_DELAY + 1);
        await moveBlocks(1);
        proposalState = await governor.state(proposalId);
        console.log(`Current proposal state ${proposalState}`);
        assert.equal(proposalState.toString(), "5");

        console.log("Executing...");
        const executeTx = await governor.execute(
          [proxyAdmin.address], // targets
          [0], // value
          [encodedFunction], // call data
          hashedDescription // description
        );
        await executeTx.wait(1);
        proposalState = await governor.state(proposalId);
        console.log(`Current proposal state ${proposalState}`);
        assert.equal(proposalState.toString(), "7");

        const newVersion = await proxyCounter.version();
        console.log(`Current contract version is ${newVersion.toString()}`);
        assert.equal(newVersion.toString(), "2");
      });
    });
