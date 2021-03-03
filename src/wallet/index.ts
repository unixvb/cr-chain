import {INITIAL_BALANCE} from "../config";
import {generateKeyPair} from "../util/chain.util";

export class Wallet {
    public balance = INITIAL_BALANCE;
    public keyPair = generateKeyPair();
    public publicKey = this.keyPair.getPublic().encode('hex', true);

    toString() {
        return `Wallet - 
        publicKey: ${this.publicKey.toString()}
        balance  : ${this.balance}`;
    }

    sign(dataHash: string) {
        return this.keyPair.sign(dataHash);
    }

}
