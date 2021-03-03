import {Blockchain} from "./blockchain";
import {Server} from "ws";
import WebSocket = require("ws");

const P2P_PORT = process.env.P2P_PORT ? +process.env.P2P_PORT : 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

export class P2PServer {
    sockets: WebSocket[] = [];

    constructor(public blockchain: Blockchain) {
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

            this.blockchain.replaceChain(data);
        })
    }

    sendChain(socket: WebSocket) {
        socket.send(JSON.stringify(this.blockchain.chain));
    }


    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }
}
