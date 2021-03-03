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
    }

    connectToPeers () {
        peers.forEach(peer => {
            const socket = new WebSocket(peer);

            socket.on('open' , () => this.connectSocket(socket));
        });
    }
}
