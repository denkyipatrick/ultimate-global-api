
const { DistributorWallet } = require("../../sequelize/models/index");
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
}