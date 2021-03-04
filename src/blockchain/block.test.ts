import {Block} from "./block";

describe('Block', () => {
    const data = 'bar';
    const lastBlock = Block.genesis();

    let block = Block.mineBlock(lastBlock, data);

    beforeEach(() => {
        block = Block.mineBlock(lastBlock, data);
    });

    it('sets the `data` to match input', () => {
        expect(block.data).toEqual(data);
    });

    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generate hash that matches difficulty', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    });

    it('lowers the difficulty for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 60 * 60 * 1000)).toEqual(block.difficulty - 1);
    })

    it('increase the difficulty for fast mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
    })
});
