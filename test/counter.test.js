const { deployments, ethers } = require("hardhat");
const { assert } = require("chai");
describe("Counter", () => {
  let counterV1, counterV2;

  beforeEach(async () => {
    await deployments.fixture(["all"]);
    counterV1 = await ethers.getContract("Counter");
    counterV2 = await ethers.getContract("CounterV2");
  });

  it("increase num in version 1", async () => {
    await counterV1.inc();
    const num = await counterV1.number();

    assert.equal(num.toString(), "1");
  });

  it("increase num in version 2", async () => {
    await counterV2.inc();
    const num = await counterV2.number();

    assert.equal(num.toString(), "1");
  });

  it("decrement num in version 1", async () => {
    await counterV1.inc();
    await counterV1.dec();
    const num = await counterV1.number();

    assert.equal(num.toString(), "0");
  });

  it("decrement num in version 2", async () => {
    await counterV2.inc();
    await counterV2.dec();
    const num = await counterV2.number();

    assert.equal(num.toString(), "0");
  });

  it("double increment version 2", async () => {
    await counterV2.doubleInc();

    const num = await counterV2.number();

    assert.equal(num.toString(), "2");
  });

  it("double decrement version 2", async () => {
    await counterV2.doubleInc();
    await counterV2.doubleInc();
    await counterV2.doubleDec();

    const num = await counterV2.number();

    assert.equal(num.toString(), "2");
  });
});
