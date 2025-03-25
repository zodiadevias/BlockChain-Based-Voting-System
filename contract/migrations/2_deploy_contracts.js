const Voting = artifacts.require("DecentralizedVoting");

module.exports = function (deployer) {
  deployer.deploy(Voting);
};
