
const { DistributorLevel } = require("../../sequelize/models/index");

module.exports = class DistributorLevelActions {
    static findAll(transaction = null) {
        return DistributorLevel.findAll({
            transaction: transaction,
            order: [['number', 'ASC']]
        });
    }

    static async findNextLevel(levelId, transaction = null) {
        const currentLevel = await DistributorLevel.findByPk(levelId, {
            transaction: transaction
        });

        return DistributorLevel.findOne({
            transaction: transaction,
            where: { number: currentLevel.number + 1 }
        });
    }
}