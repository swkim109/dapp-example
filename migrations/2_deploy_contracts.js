const simpleStorage = artifacts.require("SimpleStorage");

module.exports = function(deployer) {
    deployer.deploy(simpleStorage, 0);
};
