import {Block} from "./entity/block";

const block = new Block(123, 'test', 'wow', {awesome: 'data'});

console.log(block.toString());
