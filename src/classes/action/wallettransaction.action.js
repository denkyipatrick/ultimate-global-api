
const { WalletTransaction, Sequelize } = require("../../sequelize/models/index");
const WalletTransactionData = require("../data/wallettransaction.data");

module.exports = class WalletTransactionActions {

    /**
     * Creates a new WalletTransaction model instance.
     * @param {WalletTransactionData} walletTransactionData a WalletTransaction instance
     * @param {SequelizeTransaction} transaction a transaction for ACID
     */
    static create(walletTransactionData, transaction = null) {
        return WalletTransaction.create({
            type: walletTransactionData.type,
            amount: walletTransactionData.amount,
            isProcessed: walletTransactionData.isProcessed,
            distributorWalletId: walletTransactionData.distributorWalletId
        }, { transaction: transaction });
    }

    static findOne(id, transaction = null) {
        return WalletTransaction.findByPk(id, {
            transaction: transaction
        });
    }

    static approveTransaction(transactionId, sequelizeTransaction = null) {
        return WalletTransaction.update({
            isProcessed: true
        }, {
            transaction: sequelizeTransaction,
            where: { id: transactionId }
        })
        .then(() => WalletTransaction.findByPk(transactionId, 
            { transaction: sequelizeTransaction }));
    }
}