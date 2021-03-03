import {Block} from "./block";

export class Blockchain {
    chain: Block[] = [Block.genesis()];

    addBlock(data: any) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);

        return block;
    }

    isValidChain(chain: Block[]) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false
        }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];


            if (block.lastHash !== lastBlock.hash ||
                block.hash !== Block.blockHash(block)) {
                return false
            }
        }

        return true;
    }

    replaceChain(newChain: Block[]) {
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than a current chain');

            return;
        }

        if (!this.isValidChain(newChain)) {
            console.log('Received chain is not  valid');

            return;
        }

        console.log('Replacing blockchain with a new chain');

        this.chain = newChain;
    }

}
