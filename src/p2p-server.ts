import {Server} from "ws";
import WebSocket = require("ws");

import {Blockchain} from "./blockchain";
import {TransactionPool} from "./wallet/transaction-pool";
import {Transaction} from "./wallet/transaction";

const P2P_PORT = process.env.P2P_PORT ? +process.env.P2P_PORT : 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

enum MessageTypes {
    Chain = 'Chain',
    Transaction = 'Transaction',
    ClearTransaction = 'ClearTransaction'
}

export class P2PServer {
    sockets: WebSocket[] = [];

    constructor(public blockchain: Blockchain, public transactionPool: TransactionPool) {
    }

    listen() {
        const server = new Server({port: P2P_PORT});

        server.on('connection', (socket) => {
            this.connectSocket(socket);
        });

        this.connectToPeers();

        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }

    connectSocket(socket: WebSocket) {
        this.sockets.push(socket);

        console.log('Socket connected');

        this.messageHandler(socket);

        this.sendChain(socket);
    }

    connectToPeers() {
        peers.forEach(peer => {
            const socket = new WebSocket(peer);

            socket.on('open', () => this.connectSocket(socket));
        });
    }

    messageHandler(socket: WebSocket) {
        socket.on('message', message => {
            const data = JSON.parse(message.toString());

            switch (data.type) {
                case MessageTypes.Chain:
                    this.blockchain.replaceChain(data);
                    break;
                case MessageTypes.Transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction)
                    break;
                case MessageTypes.ClearTransaction:
                    this.transactionPool.clear();
                    break
            }

        })
    }

    sendChain(socket: WebSocket) {
        socket.send(JSON.stringify({
            type: MessageTypes.Chain,
            chain: this.blockchain.chain
        }));
    }

    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    broadcastTransaction(transaction: Transaction) {
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MessageTypes.Transaction,
            transaction
        })))
    }

    broadcastClearTransactions() {
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MessageTypes.ClearTransaction
        })))
    }
}
