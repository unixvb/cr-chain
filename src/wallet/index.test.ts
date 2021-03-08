import {Wallet} from "./index";
import {TransactionPool} from "./transaction-pool";
import {Blockchain} from "../blockchain";
import {INITIAL_BALANCE} from "../config";

describe('Wallet', () => {
    let wallet = new Wallet();
    let transactionPool = new TransactionPool();
    let blockchain = new Blockchain();

    beforeEach(() => {
        wallet = new Wallet();
        transactionPool = new TransactionPool();
        blockchain = new Blockchain();
    })

    describe('creating transaction', () => {
        const recipient = 'r3c1p13nt-h3sh';
        const sendAmount = 50;

        let transaction = wallet.createTransaction(recipient, sendAmount, blockchain, transactionPool);

        beforeEach(() => {
            transaction = wallet.createTransaction(recipient, sendAmount, blockchain, transactionPool);
        })

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, blockchain, transactionPool);
            })

            it('subtract double `sendAmount` from sender wallet', () => {
                expect(transaction?.outputs.find(output => output.address === wallet.publicKey)?.amount)
                    .toEqual(wallet.balance - 2 * sendAmount);
            })

            it('clones the `sendAmount` for the receiver', () => {
                expect(transaction?.outputs.filter(output => output.address === recipient).map(output => output.amount))
                    .toEqual([sendAmount, sendAmount]);
            })
        });
    });

    describe('calculating a balance', () => {
        const senderWallet = new Wallet();
        const addBalance = 100;
        const repeatAdd = 3;

        beforeEach(() => {
            for (let i = 0; i < repeatAdd; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance, blockchain, transactionPool);
            }
            blockchain.addBlock(transactionPool.transactions);
        });

        it('for sender wallet', () => {
            expect(senderWallet.calculateBalance(blockchain)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
        });

        it('for recipient wallet', () => {
            expect(wallet.calculateBalance(blockchain)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
        });
    });
});
