import { shortHash } from "../util/hash.util";
import {DIFFICULTY, MINE_RATE} from "../config";
import { generateHash } from "../util/chain.util";

export class Block {
    constructor(
        public timestamp: number,
        public lastHash: string,
        public hash: string,
        public data: any,
        public nonce: number,
        public difficulty = DIFFICULTY
    ) {
    }

    static genesis() {
        return new Block(10000001, '-----', 'g3n3515-f1r5t-h45h', [], 0);
    }

    static mineBlock(lastBlock: Block, data: any) {
        const lastHash = lastBlock.hash;
        let {difficulty} = lastBlock;

        let hash: string;
        let timestamp: number;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);

            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (!hash.startsWith('0'.repeat(difficulty)));


        return new Block(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp: number, lastHash: string, data: any, nonce: number, difficulty: number) {
        return generateHash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
    }

    static blockHash(block: Block) {
        const {timestamp, lastHash, data, nonce, difficulty} = block;

        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock: Block, currentTimestamp: number) {
        let { difficulty } = lastBlock;

        return  lastBlock.timestamp + MINE_RATE > currentTimestamp ? difficulty + 1 : difficulty -1;
    }

    toString = () => {
        return `Block -
            Timestamp  : ${this.timestamp}
            Last Hash  : ${shortHash(this.lastHash)}
            Hash       : ${shortHash(this.hash)}
            Nonce      : ${this.nonce}
            Difficulty : ${this.difficulty}
            Data       : ${this.data}`;
    }
}
