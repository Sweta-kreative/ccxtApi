var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { ethers } = require('ethers');
var crypto = require('crypto');
const ccxt = require ('ccxt');
const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/2d9d155eecf7489b86f896400a6d3f5e`);
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/test', function (req, res) {
        
        res.status(200).send({
            "server " : "running"
        });
        
});

router.get('/createAddress', function (req, res) {
        var id = crypto.randomBytes(32).toString('hex');
        var privateKey = "0x"+id;
        console.log("SAVE BUT DO NOT SHARE THIS:", privateKey);

        var wallet = new ethers.Wallet(privateKey);
        console.log("Address: " + wallet.address);
        res.status(200).send({
            "address " : wallet.address,
            "pvKey " : privateKey
        });
        
});

router.get('/validateAddress/:add', function (req, res) {
    console.log(ethers.utils.isAddress(req.params.add));
    res.status(200).send({
            "address " : req.params.add,
            "status " : ethers.utils.isAddress(req.params.add)
        });
});

router.get('/txHistory', async function (req, res) {
    const blockByNumber = await provider.send("eth_getBlockByNumber", ["pending", false]);
     //console.log(blockByNumber);
     const transactions = blockByNumber.transactions;
     //console.log(transactions);
    const Transactions = transactions.slice(0, 9);
    var txData = [];
     const txCount = Transactions.length.toString();
     for (let i = 0; i < txCount; i++){
         const txReceipt = await provider.getTransaction(Transactions[i])
         console.log(txReceipt.hash);
         console.log(txReceipt.blockNumber);
         console.log(txReceipt.from);
         console.log(txReceipt.to);
         const val = txReceipt.value;
         const valu = val.toHexString();
         console.log(ethers.utils.formatEther(valu))
         let tx = {
            "txHash " : txReceipt.hash,
              "block ": txReceipt.blockNumber,
              "from": txReceipt.from,
              "to": txReceipt.to,
            "amount" : ethers.utils.formatEther(valu)
         }

         txData.push(tx);
         
     }
     res.status(200).send({
            txData
        });
});

router.get('/listOfCoin', async function (req, res) {
    const exchange = new ccxt.binance ({
        // 'apiKey': '...',
        // 'secret': '...',
        'options': {
            'defaultType': 'swap',
        },
    });

    const markets = await exchange.loadMarkets ();
    //console.log(markets);
    var coinPair = [];
    for (let key in markets) {
        console.log(key);
        let coin = {
            "coinPair" : key
        }
        coinPair.push(coin);
    }

    res.status(200).send({
            "chain " : "binance",
            "coin " : coinPair
        });

});

router.get('/coinPrice', async function (req, res) {
    const exchange = new ccxt.binance({
        'verbose': process.argv.includes('--verbose'),
        'timeout': 60000,
    })
    var coinDetail = [];
    const markets = await exchange.loadMarkets ();
    for (let key in markets) {
        console.log(key);
        const response = await exchange.fetchTrades(key, 1518983548636 - 2 * 24 * 60 * 60 * 1000)
        const count = response.length.toString();
        //console.log(response)
        let currentPrice = 0;
        for (let i = 0; i < count; i++) {
            const pricecoin = (response[i].price)
            //console.log(pricecoin)
            if (pricecoin > currentPrice) {
                currentPrice = pricecoin;
            }
 
        }
        let coinData = {
            "chain" : "binance",
            "coinPair": key,
            "coinPrice":currentPrice
        }
        coinDetail.push(coinData);

    }
    console.log(currentPrice);
    res.status(200).send({
        coinDetail
        });
 

});


module.exports = router;