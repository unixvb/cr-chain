import {Block} from "./entity/block";

const fooBlock = Block.mineBlock(Block.genesis(), 'foo');

console.log(fooBlock.toString());
