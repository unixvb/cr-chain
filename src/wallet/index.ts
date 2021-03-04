import {INITIAL_BALANCE} from "../config";
import {generateKeyPair} from "../util/chain.util";
import {TransactionPool} from "./transaction-pool";
import {Transaction} from "./transaction";

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

    createTransaction(recipient: string, amount: number, transactionPool: TransactionPool) {
        if (amount > this.balance) {
            console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if (transaction) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }
}
