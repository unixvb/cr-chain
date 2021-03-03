import {SHA256} from "crypto-js";

import { shortHash } from "./util/hash.util";

export class Block {
    constructor(
        public timestamp: number,
        public lastHash: string,
        public hash: string,
        public data: any
    ) {
    }

    static genesis() {
        return new Block(10000001, '-----', 'g3n3515-f1r5t-h45h', [])
    }

    static mineBlock(lastBlock: Block, data: any) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp, lastHash, data);

        return new Block(timestamp, lastHash, hash, data);
    }

    static hash(timestamp: number, lastHash: string, data: any) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }

    static blockHash(block: Block) {
        const {timestamp, lastHash, data} = block;

        return Block.hash(timestamp, lastHash, data);
    }


    toString = () => {
        return `Block -
            Timestamp: ${this.timestamp}
            Last Hash: ${shortHash(this.lastHash)}
            Hash     : ${shortHash(this.hash)}
            Data     : ${this.data}`;
    }
}
