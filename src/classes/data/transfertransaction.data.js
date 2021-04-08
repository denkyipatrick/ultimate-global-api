
module.exports = class TransferTransactionData {
    constructor(id, transactionId, senderUsername, receiverUsername, createdAt, updatedAt) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.transactionId = transactionId;
        this.senderUsername = senderUsername;
        this.receiverUsername = receiverUsername;
    }
}