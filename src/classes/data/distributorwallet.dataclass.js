
module.exports = class DistributorWalletData {

    /**
     * Creates a new distributor wallet instance
     * @param {String} distributorUsername 
     * @param {Number} balance 
     */
    constructor(distributorUsername, balance = 0) {
        this.balance = balance;
        this.distributorUsername = distributorUsername;
    }

}