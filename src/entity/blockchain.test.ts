import {Blockchain} from "./blockchain";
import {Block} from "./block";

describe('Blockchain', () => {
    let blockchain: Blockchain;

    beforeEach(()=> {
        blockchain = new Blockchain();
    });

    it('starts with genesis block', () => {
        expect(JSON.stringify(blockchain.chain[0])).toEqual(JSON.stringify(Block.genesis()));
    }) ;

    it('adds new block', () => {
        const data = 'foo';

        blockchain.addBlock(data)

        expect(blockchain.chain[blockchain.chain.length- 1].data).toEqual(data);
    });
});
