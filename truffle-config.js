const path = require("path");
//const HDWalletProvider = require("@truffle/hdwallet-provider");
//const privateKeys = ['<private key>'];

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),

    networks: {

        development: {host: "127.0.0.1", port: 7545, network_id: "5777"},

        // rinkeby : {
        //     provider: function() {
        //         return new HDWalletProvider(privateKeys, "https://rinkeby.infura.io/v3/<API-Key>");
        //     },
        //     network_id: "4"
        // }
    },

    compilers: {
        solc: {
            version: "0.5.8",
        },
    }

};
