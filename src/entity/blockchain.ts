import {Block} from "./block";

export class Blockchain {
    chain: Block[] = [Block.genesis()];

    addBlock(data: any) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);

        return block;
    }
}
