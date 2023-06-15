const MIN_DELAY = 3600; //seconds
const VOTING_DELAY = 1; //block
const VOTING_PERIOD = 5; // blocks since I just test it on local chain 5 is enough
const QUORUM_PERCENTAGE = 4; // percent %
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const proposalsFile = "proposals.json";
module.exports = {
  MIN_DELAY,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
  ADDRESS_ZERO,
  proposalsFile,
};
