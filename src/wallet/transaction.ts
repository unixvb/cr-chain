import {uuidv4} from "../util/chain.util";
import {Wallet} from "./index";

interface TransactionOutputItem {
    amount: number;
    address: string;
}

export class Transaction {
    id = uuidv4();
    input = null;
    output: TransactionOutputItem[] = [];

    static newTransaction(senderWallet: Wallet, recipient: string, amount: number) {
        const transaction = new this();

        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceed balance.`);
            return;
        }

        transaction.output.push(
            {amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            {amount, address: recipient}
        );

        return transaction;
    }

}
