
const { DistributorDownLine, sequelize } = require("../../sequelize/models/index");
const DistributorDownLineData = require("../data/distributordownline.data");

module.exports = class DistributorDownLineActions {
    /**
     * Creates a new distributor downline
     * @param {DistributorDownLineData} distributorDownLine 
     * @param {SequelizeTransaction} transaction 
     */
    static createDistributorDownLine(distributorDownLine, transaction = null) {
        return DistributorDownLine.create({
            position: distributorDownLine.position,
            downLineUsername: distributorDownLine.downLineUsername,
            distributorUsername: distributorDownLine.distributorUsername
        }, {
            transaction: transaction
        })
    }
}