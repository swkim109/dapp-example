const ethTx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const { GANACHE_WS, GANACHE_NETWORK_ID } = require('./eth.config');
const Common = require('ethereumjs-common').default;

let NETWORK_ID;
let PROVIDER;
if (process.env.NODE_ENV === "development") {
    PROVIDER = GANACHE_WS;
    NETWORK_ID = GANACHE_NETWORK_ID;
    //PROVIDER = 'ws://localhost:8546';
    //NETWORK_ID = '444';
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
    
    //TODO 서명하려는 계정의 개인키로 변경하십시오.
    const privateKey = Buffer.from("409988a9e7e9097e5a42cb4b273e193958130f8e6a6cf7737307fc4ac5958899", "hex");
    
    try {
        
        const data = contract.methods.set(val).encodeABI();
        const txCount = await web3.eth.getTransactionCount(from);
        console.log(txCount);
        
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            from: from,
            to: address,
            data: data,
            gasLimit:web3.utils.toHex(3000000),
            gasPrice:web3.utils.toHex(web3.utils.toWei('20','gwei')),
        }
        
        //const tx = new ethTx(txObject);
        
        const local = Common.forCustomChain(
            'rinkeby',
            {
                name: 'local',
                networkId: 444,
                chainId: 444
            },
            'petersburg'
        )

        const tx = new ethTx(txObject, {common: local});
        
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
