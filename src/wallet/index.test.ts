import {Wallet} from "./index";
import {TransactionPool} from "./transaction-pool";

describe('Wallet', () => {
    let wallet = new Wallet();
    let transactionPool = new TransactionPool();

    beforeEach(() => {
        wallet = new Wallet();
        transactionPool = new TransactionPool();
    });

    describe('creating transaction', () => {
        const recipient = 'r3c1p13nt-h3sh';
        const sendAmount = 50;

        let transaction = wallet.createTransaction(recipient, sendAmount, transactionPool);

        beforeEach(() => {
            transaction = wallet.createTransaction(recipient, sendAmount, transactionPool);
        })

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, transactionPool);
            })

            it('subtract double `sendAmount` from sender wallet', () => {
                expect(transaction?.output.find(output => output.address === wallet.publicKey)?.amount)
                    .toEqual(wallet.balance - 2 * sendAmount);
            })

            it('clones the `sendAmount` for the receiver', () => {
                expect(transaction?.output.filter(output => output.address === recipient).map(output => output.amount))
                    .toEqual([sendAmount, sendAmount]);
            })
        });
    });
});
