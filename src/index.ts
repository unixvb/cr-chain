import express from "express";
import bodyParser from "body-parser";

import {Blockchain} from "./blockchain";
import {P2PServer} from "./p2p-server";
import {Wallet} from "./wallet";
import {TransactionPool} from "./wallet/transaction-pool";

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const blockchain = new Blockchain();

const wallet = new Wallet();
const transactionPool = new TransactionPool();

const p2pServer = new P2PServer(blockchain, transactionPool);

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
    const transaction = wallet.createTransaction(recipient, amount, transactionPool);

    // @ts-ignore
    p2pServer.broadcastTransaction(transaction);

    res.redirect('/transactions');
});

app.get('/public-key', (req, res) => {
    res.json({publicKey: wallet.publicKey});
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
