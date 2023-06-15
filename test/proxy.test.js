const { deployments, ethers } = require("hardhat");
const { assert } = require("chai");

describe("proxy", () => {
  let proxyCounter, proxyAdmin;

  beforeEach(async () => {
    await deployments.fixture(["all"]);
    const proxy = await ethers.getContract("Counter_Proxy");
    proxyCounter = await ethers.getContractAt("Counter", proxy.address);
    proxyAdmin = await ethers.getContract("CounterProxyAdmin");
  });

  it("set up the proxy Admin and owner of the contract should be timeLock", async () => {
    const timeLock = await ethers.getContract("TimeLock");

    const owner = await proxyAdmin.owner();

    assert.equal(owner, timeLock.address);
  });

  it("delegate the call to implementation and update the number", async () => {
    await proxyCounter.inc();

    // check storage of proxy not implementation
    const number = await proxyCounter.number();

    assert.equal(number.toString(), "1");
  });
});
