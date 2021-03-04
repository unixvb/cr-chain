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
}
