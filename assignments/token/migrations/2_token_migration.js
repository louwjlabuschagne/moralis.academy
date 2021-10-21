const MatiesCoin = artifacts.require("MatiesCoin");

module.exports = function (deployer) {
  deployer.deploy(MatiesCoin, "Stellen Coin", "SC", 1000);
};
