import {Transaction} from "./transaction";

export class TransactionPool {
    transactions: Transaction[] = [];

    updateOrAddTransaction(transaction?: Transaction) {
        if (!transaction) {
            return;
        }

        const poolTransaction = this.transactions.find(({id}) => id === transaction.id);

        if (poolTransaction) {
            this.transactions[this.transactions.indexOf(poolTransaction)] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    existingTransaction(publicKey: string) {
        return this.transactions.find(transaction => transaction.input.address === publicKey);
    }

    validTransactions() {
        return this.transactions.filter(transaction => {
            const totalOutput = transaction.outputs.reduce((prev, curr) => prev + curr.amount, 0);

            if (transaction.input.amount !== totalOutput) {
                console.log(`Invalid transaction from ${transaction.input.address}.`)

                return false;
            }

            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.input.address}.`)

                return false;
            }

            return true;
        });
    }

    clear() {
        this.transactions = [];
    }
}
