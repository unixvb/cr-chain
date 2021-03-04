import {Transaction} from "./transaction";
import {Wallet} from "./index";

describe('Transaction', () => {
    const wallet = new Wallet();
    const amount = 100;
    const recipient = 'r3c1p1ent';

    let transaction = Transaction.newTransaction(wallet, recipient, amount);

    beforeEach(() => {
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction?.output.find(output => output.address === wallet.publicKey)?.amount).toEqual(wallet.balance - amount);
    });

    it('outputs the `amount` added to the recipient balance', () => {
        expect(transaction?.output.find(output => output.address === recipient)?.amount).toEqual(amount);
    });

    it('does not create a transaction if balance is exceeded', () => {
        transaction = Transaction.newTransaction(wallet, recipient, 5000);

        expect(transaction).toEqual(undefined);
    });

    it('inputs the balance of the wallet', () => {
        expect(transaction?.input?.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction', () => {
        if (transaction) {
            expect(Transaction.verifyTransaction(transaction)).toEqual(true);
        }
    })

    it('invalidates a corrupt transaction', () => {
        if (transaction) {
            transaction.output[0].amount = 5000;

            expect(Transaction.verifyTransaction(transaction)).toEqual(false);
        }
    })
});
