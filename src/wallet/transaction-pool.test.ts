import {TransactionPool} from "./transaction-pool";
import {Wallet} from "./index";
import {Transaction} from "./transaction";
import {Blockchain} from "../blockchain";

describe('TransactionPool', () => {
    const transactionPool = new TransactionPool();
    const wallet = new Wallet();
    const blockchain = new Blockchain();
    const transaction = wallet.createTransaction('r3s1p13nt-w4ll3t', 50, blockchain, transactionPool);

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

    describe('mixing valid and corrupt transactions', () => {
        const validTransactions: Transaction[] = [...transactionPool.transactions];

        beforeAll(() => {
            for (let i = 0; i < 6; i++) {
                const wallet = new Wallet();
                const transaction = wallet.createTransaction('r3c1p13nt-h4sh', 50, blockchain, transactionPool);

                if (!transaction) {
                    throw new Error('Transaction is undefined');
                }

                if (i % 2 === 0) {
                    validTransactions.push(transaction);
                } else {
                    transaction.input.amount = 99999;
                }
            }
        });

        it('shows a different between valid and corrupt transactions', () => {
            expect(JSON.stringify(transactionPool.transactions)).not.toEqual(JSON.stringify(validTransactions));
        })

        it('grabs valid transactions', () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });
    });

    it('clears transactions', () => {
        transactionPool.clear();

        expect(transactionPool.transactions).toEqual([]);
    });
});
