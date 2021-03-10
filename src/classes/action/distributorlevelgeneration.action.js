
const { DistributorLevelGeneration, Sequelize, sequelize } = require("../../sequelize/models/index");
const DistributorLevelGenerationData = require("../data/distributorlevelgeneration.data");

module.exports = class DistributorLevelGenerationActions {

    static async doesDistributorHaveLevelDirectChild(
        distributorUsername, 
        levelId, 
        position, 
        transaction = null) {
        return await DistributorLevelGeneration.findOne({
            transaction: transaction,
            where: {
                [Sequelize.Op.and]: [
                    { upLineUsername: distributorUsername },
                    { position: position },
                    { levelId: levelId  }
                ]
            }
        }) ? true : false
    }

    static hasLeftChild(username, levelId, transaction = null) {
        return this.doesDistributorHaveLevelDirectChild(
            username, levelId, 'left', transaction
        );
    }
    
    static hasRightChild(username, levelId, transaction = null) {
        return this.doesDistributorHaveLevelDirectChild(
            username, levelId, 'right', transaction
        );
    }

    static async findDistributorLevelDirectDownLines(
        distributorUsername, 
        levelId, transaction = null) {
        return DistributorLevelGeneration.findOne({
            transaction: transaction,
            where: {
                [Sequelize.Op.and]: [
                    { upLineUsername: distributorUsername },
                    { levelId: levelId  }
                ]
            }
        })
    }

    static async isDistributorInLevelGeneration(levelId, distributorUsername, transaction = null) {
        const data = await DistributorLevelGeneration.findOne({
            transaction: transaction,
            where: {
                [Sequelize.Op.and]: [
                    { levelId: levelId },
                    { username: distributorUsername }
                ]
            }
        });

        return data ? true : false
    }








    /**
     * Creates a new distributor down line model instance
     * @param {DistributorLevelGenerationData} distributorLevelDownLine 
     * @param {*} sequelizeTransaction a sequelizeTransaction to support ACID
     */
    static async create(distributorLevelDownLine, sequelizeTransaction = null) {
        let downLinePosition = null;

        if (await this.isLeftPositionAvailable(
            distributorLevelDownLine.distributorUsername,
            distributorLevelDownLine.distributorLevel,
            sequelizeTransaction)) {
                downLinePosition = 'left'
        } else if (await this.isRightPositionAvailable(
            distributorLevelDownLine.distributorUsername,
            distributorLevelDownLine.distributorLevel,
            sequelizeTransaction)) {
                downLinePosition = 'right'
        } else {
            // return error message
            return Promise.reject('left_and_right_positions_occupied')
        }

        return DistributorLevelGeneration.create({
            downLinePosition: downLinePosition,
            distributorLevel: distributorLevelDownLine.distributorLevel,
            downLineUsername: distributorLevelDownLine.downLineUsername,
            distributorUsername: distributorLevelDownLine.distributorUsername
        }, { transaction: sequelizeTransaction });
    }

    /**
     * Finds a distributor's direct down line
     * @param {String} username the username of the upLine to find direct downLine
     * @param {String} distributorLevelId the id of the current level of the upLine
     * @param {String} downLinePosition the position of the downLine like left or right
     * @param {SequelizeTransaction} sequelizeTransaction a transaction object for ACID
     */
    static findDistributorDirectDownLine(
        username, distributorLevelId, downLinePosition, 
        sequelizeTransaction = null) {
        return DistributorLevelGeneration.findOne({
            transaction: sequelizeTransaction,
            where: {
                [Sequelize.Op.and]: [
                    { distributorUsername: username },
                    { downLinePosition: downLinePosition },
                    { distributorLevel: distributorLevelId  }
                ]
            }
        })
    }

    /**
     * Checks whether the left position of a distributor is empty
     * @param {String} username username of the upLine
     * @param {String} levelId id of the distributor's current level
     * @param {SequelizeTransaction} sequelizeTransaction a transaction object for ACID
     */
    static async isLeftPositionAvailable(username, levelId, sequelizeTransaction = null) {
        const leftDownLine = await this.findDistributorDirectDownLine(
            username, levelId, 'left', sequelizeTransaction
        );
        
        return leftDownLine ? false : true
    }

    /**
     * Checks whether the right position of a distributor is empty
     * @param {String} username username of the upLine
     * @param {String} levelId id of the distributor's current level
     * @param {SequelizeTransaction} sequelizeTransaction a transaction object for ACID
     */
    static async isRightPositionAvailable(username, levelId, sequelizeTransaction = null) {
        const rightDownLine = await this.findDistributorDirectDownLine(
            username, levelId, 'right', sequelizeTransaction
        );
        
        return rightDownLine ? false : true
    }

    /**
     * Finds the upLine of a distributor at a particular level.
     * @param {String} downLineUsername username of down line who we are finding up line
     * @param {String} levelId the level id of the up line
     * @param {SequelizeTransaction} sequelizeTransaction a transaction object for ACID
     */
    static findUpLine(downLineUsername, levelId, sequelizeTransaction = null) {
        return DistributorLevelGeneration.findOne({
            transaction: sequelizeTransaction,
            where: {
                [Sequelize.Op.and]: [
                    { distributorLevel: levelId },
                    { downLineUsername: downLineUsername }
                ]
            }
        });
    }

    static findUpLineStarterGeneration(username, sequelizeTransaction = null) {
        return DistributorLevelGeneration.findAll({
            transaction: sequelizeTransaction,
            where: {
                [Sequelize.Op.and]: [
                    { distributorUsername: username },
                    { distributorLevel: 'starter_stage_1' }
                ]
            }
        });
    }
}