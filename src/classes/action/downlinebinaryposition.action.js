
const { DistributorDownLine, DownLineBinaryPosition, 
    sequelize } = require("../../sequelize/models/index");
const DownLineBinaryPositionData = require("../data/downlinebinaryposition.data");

module.exports = class DistributorDownLineActions {
    /**
     * 
     * @param {DownLineBinaryPositionData} downLineBinaryPosition 
     * @param {SequelizeTransaction} transaction 
     */
    static createDownLineBinaryPosition(downLineBinaryPosition, transaction = null) {
        return DownLineBinaryPosition.create({
            position: downLineBinaryPosition.position,
            distributorUsername: downLineBinaryPosition.distributorUsername
        }, { transaction: transaction });
    }
}