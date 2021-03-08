import express from "express";
import bodyParser from "body-parser";

import {Blockchain} from "./blockchain";
import {P2PServer} from "./p2p-server";
import {Wallet} from "./wallet";
import {TransactionPool} from "./wallet/transaction-pool";
import {Miner} from "./miner";

const HTTP_PORT = process.env.HTTP_PORT || 3001;

console.log('SALLAM1');

const app = express();
const blockchain = new Blockchain();

const wallet = new Wallet();
const transactionPool = new TransactionPool();

const p2pServer = new P2PServer(blockchain, transactionPool);

const miner = new Miner(blockchain, transactionPool, wallet, p2pServer);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`);

    p2pServer.syncChains();

    res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
    res.json(transactionPool.transactions);
});

app.post('/transact', (req, res) => {
    const {recipient, amount} = req.body;
    const transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool);

    if (transaction) {
        p2pServer.broadcastTransaction(transaction);

        res.redirect('/transactions');
    }
});

app.get('/mine-transactions', (req, res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);

    res.redirect('/blocks');
});

app.get('/public-key', (req, res) => {
    res.json({publicKey: wallet.publicKey});
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
