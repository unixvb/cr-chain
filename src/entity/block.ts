import { shortHash } from "../util/hash.util";

export class Block {
    constructor(
        public timestamp: number,
        public lastHash: string,
        public hash: string,
        public data: any
    ) {
    }

    public static genesis () {
        return new this(10000001, '-----', 'g3n3515-f1r5t-h45h', [])
    }

    public toString = () => {
        return `Block -
            Timestamp: ${this.timestamp}
            Last Hash: ${shortHash(this.lastHash)}
            Hash     : ${shortHash(this.hash)}
            Data     : ${this.data}`;
    }
}
