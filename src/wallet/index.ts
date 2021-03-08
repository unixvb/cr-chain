import {INITIAL_BALANCE} from "../config";
import {generateKeyPair} from "../util/chain.util";
import {TransactionPool} from "./transaction-pool";
import {Transaction} from "./transaction";
import {Blockchain} from "../blockchain";

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

    createTransaction(recipient: string, amount: number, blockchain: Blockchain<Transaction>, transactionPool: TransactionPool) {
        this.balance = this.calculateBalance(blockchain);

        if (amount > this.balance) {
            console.error(`Amount: ${amount} exceeds current balance: ${this.balance}`);

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

    calculateBalance(blockchain: Blockchain) {
        const transactions: Transaction[] = [];
        let startTime = 0;
        let balance = INITIAL_BALANCE;

        blockchain.chain.forEach(block => block.data.forEach(transaction => transactions.push(transaction)));

        const walletInputTransactions = transactions.filter(transaction => transaction.input.address === this.publicKey);

        if (walletInputTransactions.length > 0) {
            const recentWalletInputTransaction = walletInputTransactions.reduce(
                (prev, curr) => prev.input.timestamp > curr.input.timestamp ? prev : curr
            );

            balance = recentWalletInputTransaction.outputs.find(output => output.address === this.publicKey)?.amount ?? balance;
            startTime = recentWalletInputTransaction.input.timestamp;
        }

        transactions
            .filter(transaction => transaction.input.timestamp > startTime)
            .forEach(transaction => transaction.outputs.forEach(output => {
                if (output.address === this.publicKey) {
                    balance += output.amount;
                }
            }));

        return balance;
    }

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.publicKey = 'bl0ckch41n-w4ll3t';

        return blockchainWallet;

    }
}
