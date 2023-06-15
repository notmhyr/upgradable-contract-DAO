const { ethers, network } = require("hardhat");
const { MIN_DELAY } = require("../helper.config");
const moveBlocks = require("../utils/moveBlocks");
const moveTime = require("../utils/moveTime");

const main = async () => {
  const chainId = network.config.chainId;

  // getting contracts
  const governor = await ethers.getContract("GovernorContract");
  const proxyAdmin = await ethers.getContract("CounterProxyAdmin");

  const proxy = await ethers.getContract("Counter_Proxy");
  const proxyCounter = await ethers.getContractAt("Counter", proxy.address);

  const counterV2 = await ethers.getContract("CounterV2");

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

  console.log("Queueing...");
  const queueTx = await governor.queue(
    [proxyAdmin.address], // targets
    [0], // value
    [encodedFunction], // call data
    hashedDescription // description
  );
  await queueTx.wait(1);

  // move blocks and time if local chain detected
  if (chainId == 31337) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  // executing
  console.log("Executing...");
  const executeTx = await governor.execute(
    [proxyAdmin.address], // targets
    [0], // value
    [encodedFunction], // call data
    hashedDescription // description
  );

  await executeTx.wait(1);

  console.log("counter version is upgraded");

  // now the contract implementation should be upgraded from v1 to v2 :)
  const counterVersion = await proxyCounter.version();

  console.log(`counter version is ${counterVersion.toString()}`);
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
