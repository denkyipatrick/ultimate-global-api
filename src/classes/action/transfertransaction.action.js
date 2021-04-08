
const { TransferTransaction, Sequelize } = require("../../sequelize/models/index");
const TransferTransactionData = require("../data/transfertransaction.data");

module.exports = class TransferTransactionActions {

    /**
     * Creates a new TransferTransaction model instance.
     * @param {TransferTransactionData} transferTransactionData a TransferTransaction instance
     * @param {SequelizeTransaction} sequelizeTransaction a transaction for ACID
     */
    static create(transferTransactionData, sequelizeTransaction = null) {
        return TransferTransaction.create({
            transactionId: transferTransactionData.transactionId,
            senderUsername: transferTransactionData.senderUsername,
            receiverUsername: transferTransactionData.receiverUsername
        }, { transaction: sequelizeTransaction });
    }

}