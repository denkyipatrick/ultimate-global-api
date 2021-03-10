
const { UpLineLevel, Sequelize } = require("../../sequelize/models/index");

module.exports = class UpLineLevelActions {
    static findDistributorLevel(username, distributorLevelId, transaction = null) {
        return UpLineLevel.findOne({
            transaction: transaction,
            where: { 
                [Sequelize.Op.and]: [
                    { levelId: distributorLevelId },
                    { distributorUsername: username }
                ]
             }
        });
    }
}