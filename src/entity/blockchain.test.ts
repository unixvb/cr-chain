import {Blockchain} from "./blockchain";
import {Block} from "./block";

describe('Blockchain', () => {
    let blockchain: Blockchain,
        blockchain2: Blockchain;

    beforeEach(()=> {
        blockchain = new Blockchain();
        blockchain2 = new Blockchain();
    });

    it('starts with genesis block', () => {
        expect(JSON.stringify(blockchain.chain[0])).toEqual(JSON.stringify(Block.genesis()));
    }) ;

    it('adds new block', () => {
        const data = 'foo';

        blockchain.addBlock(data)

        expect(blockchain.chain[blockchain.chain.length- 1].data).toEqual(data);
    });

    it('validate a valid chain', () => {
        blockchain2.addBlock('foo');

        expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
    });

    it('invalidate chain with corrupted genesis block', () => {
        blockchain2.chain[0].data = 'invalid data';

        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
    });

    it ('invalidate corrupt chain', () => {
        blockchain2.addBlock('foo');
        blockchain2.chain[1].data = 'not foo';

        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
    });

    it('replaces a chain with a valid chain', () => {
        blockchain2.addBlock('meow');
        blockchain.replaceChain(blockchain2.chain);

        expect(blockchain.chain).toEqual(blockchain2.chain)
    });

    it('does not replace a chain with one less than length', () => {
        blockchain.addBlock('foo');
        blockchain.replaceChain(blockchain2.chain);

        expect(blockchain.chain).not.toEqual(blockchain2.chain);
    });

    it('does not replace a chain with one equal to length', () => {
        blockchain.addBlock('foo');
        blockchain2.addBlock('moo');
        blockchain.replaceChain(blockchain2.chain);

        expect(blockchain.chain).not.toEqual(blockchain2.chain);
    });
});
