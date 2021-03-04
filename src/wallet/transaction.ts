import {ec} from "elliptic";
import {generateHash, uuidv4, verifySignature} from "../util/chain.util";
import {Wallet} from "./index";

interface TransactionBaseInfo {
    amount: number;
    address: string;
}

interface TransactionOutputItem extends TransactionBaseInfo {
}

interface TransactionInput extends TransactionBaseInfo {
    timestamp: number,
    signature: ec.Signature
}

export class Transaction {
    id = uuidv4();
    // @ts-ignore
    input: TransactionInput;
    output: TransactionOutputItem[] = [];

    static newTransaction(senderWallet: Wallet, recipient: string, amount: number) {
        const transaction = new this();

        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds the balance.`);
            return;
        }

        transaction.output.push(
            {amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            {amount, address: recipient}
        );

        Transaction.signTransaction(transaction, senderWallet);

        return transaction;
    }

    static signTransaction(transaction: Transaction, senderWallet: Wallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(generateHash(transaction.output))
        }
    }

    static verifyTransaction(transaction: Transaction) {
        return verifySignature(transaction.input.address, transaction.input.signature, generateHash(transaction.output));
    }

    update(senderWallet: Wallet, recipient: string, amount: number) {
        const senderOutput = this.output.find(output => output.address === senderWallet.publicKey);

        if (!senderOutput) {
            return;
        }

        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds the balance.`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.output.push({amount, address: recipient});
        Transaction.signTransaction(this, senderWallet);

        return this;
    }
}
