import {TransactionPool} from "./transaction-pool";
import {Wallet} from "./index";
import {Transaction} from "./transaction";

describe('TransactionPool', () => {
    const transactionPool = new TransactionPool();
    const wallet = new Wallet();
    const transaction = Transaction.newTransaction(wallet, 'r3s1p13nt-w4ll3t', 50);

    beforeEach(() => {
        transactionPool.updateOrAddTransaction(transaction);
    })

    it('adds a transaction to the pool', () => {
        expect(transactionPool.transactions.find(({id}) => id === transaction?.id)).toEqual(transaction);
    });

    it('updates a transaction in the pool', () => {
        const oldTransaction = {...transaction};
        const newTransaction = transaction?.update(wallet, 'n3w-w4ll3t', 30);
        transactionPool.updateOrAddTransaction(newTransaction);

        expect(transactionPool.transactions.find(({id}) => id === newTransaction?.id))
            .not.toEqual(oldTransaction);
    })
});
