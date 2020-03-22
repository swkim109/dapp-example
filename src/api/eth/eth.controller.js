const ethTx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const { GANACHE_WS, GANACHE_NETWORK_ID } = require('./eth.config');

let NETWORK_ID;
let PROVIDER;
if (process.env.NODE_ENV === "development") {
    PROVIDER = GANACHE_WS;
    NETWORK_ID = GANACHE_NETWORK_ID;
}

//const web3 = new Web3(new Web3.providers.WebsocketProvider(PROVIDER));
const web3 = new Web3(PROVIDER);
const abi = require('../../../client/src/contracts/SimpleStorage.json').abi;
const address = require('../../../client/src/contracts/SimpleStorage.json').networks[NETWORK_ID].address;


set = async (ctx) => {

    const {from, val} = ctx.request.body;

    const contract = new web3.eth.Contract(abi, address);

    try {

        //The encoded ABI byte code to send via a transaction or call.
        const data = contract.methods.set(val).encodeABI();

        let txObject = {};
        // const txCount = await web3.eth.getTransactionCount(from);
        // txObject["nonce"] = txCount;
        txObject["from"] = from;
        txObject["to"] = address;
        txObject["data"] = data;
        txObject["gasLimit"] = web3.utils.toHex(3000000);
        txObject["gasPrice"] = web3.utils.toHex(web3.utils.toWei('20','gwei'));

        ctx.body = {success: true, rawTx: txObject};

    } catch (err) {
        console.log(err);
        ctx.throw(500);
    }
}


setTx = async (ctx) => {

    const {from, val} = ctx.request.body;

    const contract = new web3.eth.Contract(abi, address);
    const privateKey = Buffer.from("5de6abc8439867acc2d5cf7fa9d5f0e8ebce2222b643926704ecca1641b5fd9f", "hex");

    try {

        const data = contract.methods.set(val).encodeABI();
        const txCount = await web3.eth.getTransactionCount(from);

        const txObject = {
            nonce: web3.utils.toHex(txCount),
            from: from,
            to: address,
            data: data,
            gasLimit:web3.utils.toHex(3000000),
            gasPrice:web3.utils.toHex(web3.utils.toWei('20','gwei')),
        }

        const tx = new ethTx(txObject,  { chain: 'mainnet', hardfork: 'petersburg' });
        tx.sign(privateKey); // sign a transaction with a given private key(32 bytes)
        console.log(tx.verifySignature());
        const serializedTx = tx.serialize();

        // web3.eth.sendSignedTransaction(signedTransactionData [, callback])
        // Signed transaction data in HEX format
        const txHash = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

        ctx.body = {success: true, txHash};

    } catch (err) {
        console.log(err);
        ctx.throw(500);
    }
}



module.exports = {
    set,
    setTx
}
