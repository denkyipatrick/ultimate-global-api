
module.exports = class WalletTransactionData {
    /**
     * Creates a new WalletTransaction instance
     * @param {String} id id of WalletTransaction
     * @param {String} distributorWalletId distributor wallet id
     * @param {Number} amount amount transacted
     * @param {String} type type of transaction like deposit or withdrawal
     * @param {Boolean} isProcessed determines if a transaction is processed
     * @param {Date} createdAt date transaction was created
     * @param {Date} updatedAt date transaction was updated
     */
    constructor(id, distributorWalletId, amount, type, isProcessed = false, createdAt = null, updatedAt = null) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isProcessed = isProcessed;
        this.distributorWalletId = distributorWalletId;
    }
}