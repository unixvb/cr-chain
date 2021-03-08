import {Blockchain} from "./blockchain";
import {TransactionPool} from "./wallet/transaction-pool";
import {Wallet} from "./wallet";
import {P2PServer} from "./p2p-server";
import {Transaction} from "./wallet/transaction";

export class Miner {
    constructor(
        public blockchain: Blockchain,
        public transactionPool: TransactionPool,
        public wallet: Wallet,
        public p2pServer: P2PServer
    ) {
    }

    mine() {
        const validTransactions = this.transactionPool.validTransactions();
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()))

        const block = this.blockchain.addBlock(validTransactions);
        this.p2pServer.syncChains();

        this.transactionPool.clear();
        this.p2pServer.broadcastClearTransactions();

        return block;
    }
}
