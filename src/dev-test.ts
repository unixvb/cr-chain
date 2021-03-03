import {Blockchain} from "./blockchain";

const blockchain = new Blockchain();

for (let i= 0; i < 10; i++) {
    console.log(blockchain.addBlock(i).toString());
}
