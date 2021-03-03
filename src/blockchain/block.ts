import {SHA256} from "crypto-js";

import {DIFFICULTY} from "../config";
import {shortHash} from "./util/hash.util";

export class Block {
    constructor(
        public timestamp: number,
        public lastHash: string,
        public hash: string,
        public data: any,
        public nonce: number
    ) {
    }

    static genesis() {
        return new Block(10000001, '-----', 'g3n3515-f1r5t-h45h', [], 0)
    }

    static mineBlock(lastBlock: Block, data: any) {
        const lastHash = lastBlock.hash;

        let hash: string;
        let timestamp: number;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();

            hash = Block.hash(timestamp, lastHash, data, nonce);
        } while (!hash.startsWith('0'.repeat(DIFFICULTY)));


        return new Block(timestamp, lastHash, hash, data, nonce);
    }

    static hash(timestamp: number, lastHash: string, data: any, nonce: number) {
        return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString();
    }

    static blockHash(block: Block) {
        const {timestamp, lastHash, data, nonce} = block;

        return Block.hash(timestamp, lastHash, data, nonce);
    }


    toString = () => {
        return `Block -
            Timestamp: ${this.timestamp}
            Last Hash: ${shortHash(this.lastHash)}
            Hash     : ${shortHash(this.hash)}
            Nonce    : ${this.nonce}
            Data     : ${this.data}`;
    }
}
