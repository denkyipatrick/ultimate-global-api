
const { DistributorWallet, Sequelize } = require("../../sequelize/models/index");
const DistributorWalletData = require("../data/distributorwallet.dataclass");

module.exports = class DistributorWalletActions {
    /**
     * Creates a new distributor wallet model in the database.
     * @param {DistributorWalletData} distributorWallet a DistributorWallet data class instance.
     * @param {SequelizeTransaction} sequelizeTransaction a sequelize transaction object for ACID
     */
    static create(distributorWallet, sequelizeTransaction = null) {
        return DistributorWallet.create({
            balance: distributorWallet.balance,
            distributorUsername: distributorWallet.distributorUsername
        }, {
            transaction: sequelizeTransaction
        });
    }

    static findOne(walletId, sequelizeTransaction = null) {
        return DistributorWallet.findByPk(walletId, {
            transaction: sequelizeTransaction
        });
    }
    
    static debit(walletTransaction, transaction = null) {
        return DistributorWallet.update({
            balance: Sequelize.literal(`balance - ${walletTransaction.amount}`)
        }, {
            transaction: transaction,
            where: { id: walletTransaction.distributorWalletId }
        })
        .then(() => DistributorWallet.findByPk(walletTransaction.distributorWalletId, 
            { transaction: transaction }));
    }

    static credit(walletTransaction, transaction = null) {
        return DistributorWallet.update({
            balance: Sequelize.literal(`balance + ${walletTransaction.amount}`)
        }, {
            transaction: transaction,
            where: { id: walletTransaction.distributorWalletId }
        })
        .then(() => DistributorWallet.findByPk(walletTransaction.distributorWalletId, 
            { transaction: transaction }));
    }
}