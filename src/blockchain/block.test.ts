import {Block} from "./block";
import {DIFFICULTY} from "../config";

const sum = (a: number, b: number) => a + b;

describe('Block', () => {
    let data: any, lastBlock: Block, block: Block;

    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('sets the `data` to match input', () => {
        expect(block.data).toEqual(data);
    });

    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generate hash that matches difficulty', () => {
        expect(block.hash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
    });
});
