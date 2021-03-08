import {Transaction} from "./transaction";
import {Wallet} from "./index";
import {MINING_REWARD} from "../config";

describe('Transaction', () => {
    const wallet = new Wallet();
    const amount = 100;
    const recipient = 'r3c1p1ent';

    let transaction = Transaction.newTransaction(wallet, recipient, amount);

    beforeEach(() => {
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction?.outputs.find(output => output.address === wallet.publicKey)?.amount).toEqual(wallet.balance - amount);
    });

    it('outputs the `amount` added to the recipient balance', () => {
        expect(transaction?.outputs.find(output => output.address === recipient)?.amount).toEqual(amount);
    });

    it('does not create a transaction if balance is exceeded', () => {
        transaction = Transaction.newTransaction(wallet, recipient, 5000);

        expect(transaction).toEqual(undefined);
    });

    it('inputs the balance of the wallet', () => {
        expect(transaction?.input.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction', () => {
        if (transaction) {
            expect(Transaction.verifyTransaction(transaction)).toEqual(true);
        }
    })

    it('invalidates a corrupt transaction', () => {
        if (transaction) {
            transaction.outputs[0].amount = 5000;

            expect(Transaction.verifyTransaction(transaction)).toEqual(false);
        }
    })

    describe('updating transaction', () => {
        const nextAmount = 20;
        const nextRecipient = 'n3xt-r2c1p13nt';

        beforeEach(() => {
            transaction = transaction?.update(wallet, nextRecipient, nextAmount)
        });

        it('subtract the next amount from the senders output', () => {
            expect(transaction?.outputs.find(output => output.address === wallet.publicKey)?.amount)
                .toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next recipient', () => {
            expect(transaction?.outputs.find(output => output.address === nextRecipient)?.amount)
                .toEqual(nextAmount);
        });
    });

    it(`rewards the miner's wallet`, () => {
        transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());

        expect(transaction.outputs.find(output => output.address === wallet.publicKey)?.amount)
            .toEqual(MINING_REWARD);
    });
});
