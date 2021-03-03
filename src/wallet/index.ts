import {INITIAL_BALANCE} from "../config";
import {genKeyPair} from "../util/chain.util";

export class Wallet {
    public balance = INITIAL_BALANCE;
    public keyPair = genKeyPair();
    public publicKey = this.keyPair.getPublic().encode('hex', true);

    toString() {
        return `Wallet - 
        publicKey: ${this.publicKey.toString()}
        balance  : ${this.balance}`;
    }
}
