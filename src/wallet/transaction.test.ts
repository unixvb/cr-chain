import {Transaction} from "./transaction";
import {Wallet} from "./index";

describe('Transaction', () => {
    let transaction: Transaction | undefined;
    let wallet: Wallet;
    let amount: number;
    let recipient: string;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 100;
        recipient = 'r3c1p1ent';
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
});
