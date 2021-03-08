import {ec} from "elliptic";
import {generateHash, uuidv4, verifySignature} from "../util/chain.util";
import {Wallet} from "./index";
import {MINING_REWARD} from "../config";

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
    outputs: TransactionOutputItem[] = [];

    static transactionWithOutputs(senderWallet: Wallet, outputs: TransactionOutputItem[]) {
        const transaction = new this();

        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);

        return transaction;
    }

    static newTransaction(senderWallet: Wallet, recipient: string, amount: number) {
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds the balance.`);
            return;
        }

        return Transaction.transactionWithOutputs(senderWallet, [
            {amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            {amount, address: recipient}],
        );
    }

    static rewardTransaction(minerWallet: Wallet, blockchainWallet: Wallet) {
        return Transaction.transactionWithOutputs(blockchainWallet, [
            {amount: MINING_REWARD, address: minerWallet.publicKey}
        ])
    }

    static signTransaction(transaction: Transaction, senderWallet: Wallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(generateHash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction: Transaction) {
        return verifySignature(transaction.input.address, transaction.input.signature, generateHash(transaction.outputs));
    }

    update(senderWallet: Wallet, recipient: string, amount: number) {
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

        if (!senderOutput) {
            return;
        }

        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds the balance.`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({amount, address: recipient});
        Transaction.signTransaction(this, senderWallet);

        return this;
    }
}
