const { 
    Distributor,  
    UpLineLevel,
    UpLineLevelDownLine,
    DistributorLevel,
    DistributorLevelGeneration,
    DistributorWallet,
    DownLineBinaryPosition,
    Sequelize, sequelize } = require("../../sequelize/models/index");
const DistributorData = require("../data/distributor.data");
const DistributorDownLineData = require("../data/distributordownline.data");
const DistributorLevelActions = require("./distributorlevel.action");
const UpLineLevelActions = require("./uplinelevel.action");

module.exports = class DistributorActions {
    
    /**
     * Creates a new distributor model in the database.
     * @param {DistributorData} distributor a distributor data class instance.
     * @param {SequelizeTransaction} sequelizeTransaction a sequelize transaction object for ACID
     */
    static createDistributor(distributor, sequelizeTransaction = null) {
        return Distributor.create({
            username: distributor.username,
            lastName: distributor.lastName,
            firstName: distributor.firstName,
            phoneNumber: distributor.phoneNumber,
            distributorLevelId: "starter_stage_1",
            upLineUsername: distributor.upLineUsername,
            sponsorUsername: distributor.sponsorUsername
        }, {
            transaction: sequelizeTransaction
        });
    }

    static findDistributor(username, transaction = null) {
        return Distributor.findByPk(username, {
            transaction: transaction
        });
    }

    static findDistributorUpLine(distributorUsername, transaction = null) {
        return Distributor.findByPk(distributorUsername, {
            transaction: transaction
        });
    }
    
    static async find2ndUpDistributorUpLine(distributorUsername, transaction = null) {
        const fistUpLine = await this.findDistributorUpLine(
            distributorUsername, transaction);

        return Distributor.findByPk(fistUpLine.upLineUsername, {
            transaction: transaction,
            include: [
                'stage', 'upLine',
                { as: 'downLines', model: Distributor, include: [
                    'stage', 'binaryPosition',
                    { model: Distributor, as: 'downLines', include: [
                        'stage', 'binaryPosition'
                    ] }
                ]
            }]
        });
    }

    static findRubyDownLines(distributorUsername, transaction = null) {
        return Distributor.findAll({
            transaction: transaction,
            where: { username: distributorUsername },
            include: [
                { model: Distributor, as: 'downLines', where: { distributorLevelId: 'ruby_stage_3' },  include: [
                    { model: DownLineBinaryPosition, as: 'binaryPosition' },
                    { model: Distributor, as: 'downLines',where: { distributorLevelId: 'ruby_stage_3' }, include: [
                        { model: DownLineBinaryPosition, as: 'binaryPosition' },
                        { model: Distributor, as: 'downLines', where: { distributorLevelId: 'ruby_stage_3' } }
                    ] },
                ] }
            ]
        });
    }
    
    static findDistributorLeaderGeneration(distributorUsername, transaction = null) {
        return Distributor.findAll({
            transaction: transaction,
            where: { username: distributorUsername },
            include: [
                { model: Distributor, as: 'downLines', where: { distributorLevelId: 'leader_stage_2' },  include: [
                    { model: DownLineBinaryPosition, as: 'binaryPosition' },
                    { model: Distributor, as: 'downLines',where: { distributorLevelId: 'leader_stage_2' }, include: [
                        { model: DownLineBinaryPosition, as: 'binaryPosition' },
                        { model: Distributor, as: 'downLines', where: { distributorLevelId: 'leader_stage_2' } }
                    ] },
                ] }
            ]
        });
    }

    static findDistributorStarterGeneration(distributorUsername, transaction = null) {
        return Distributor.findAll({
            transaction: transaction,
            where: { username: distributorUsername },
            include: [
                { model: DistributorLevel, as: 'stage' },
                { model: Distributor, as: 'downLines', include: [
                    'binaryPosition',
                    'stage',
                    { model: Distributor, as: 'downLines', include: [
                        'binaryPosition',
                        'stage'
                    ] }
                ] }
            ]
        });
    }
    
    static findDistributorStage2DownLines(distributorUsername, transaction = null) {
        return Distributor.findAll({
            transaction: transaction,
            where: {
                [Sequelize.Op.and]: [
                    { upLineUsername: distributorUsername },
                    { distributorLevelId: 'leader_stage_2' }
                ]
            }, include: [
                { model: Distributor, as: 'downLines', where: { distributorLevelId: 'leader_stage_2' },  include: [
                    { model: DownLineBinaryPosition, as: 'binaryPosition' }
                    // { model: Distributor, as: 'downLines',where: { distributorLevelId: 'leader_stage_2' }, include: [
                    //     { model: DownLineBinaryPosition, as: 'binaryPosition' },
                    //     { model: Distributor, as: 'downLines', where: { distributorLevelId: 'leader_stage_2' } }
                    // ] },
                ]}
            ]
        });

        return Distributor.findAll({
            transaction: transaction,
            where: { username: distributorUsername },
            include: [
                { model: Distributor, as: 'downLines', where: { distributorLevelId: 'leader_stage_2' },  include: [
                    { model: DownLineBinaryPosition, as: 'binaryPosition' },
                    // { model: Distributor, as: 'downLines',where: { distributorLevelId: 'leader_stage_2' }, include: [
                    //     { model: DownLineBinaryPosition, as: 'binaryPosition' },
                    //     { model: Distributor, as: 'downLines', where: { distributorLevelId: 'leader_stage_2' } }
                    // ] },
                ] }
            ]
        });
    }

    static findDistributorDirectDownLines(distributorUsername, transaction = null) {
        return Distributor.findAll({
            transaction: transaction,
            where: { upLineUsername: distributorUsername },
            include: [ 
                { as: 'binaryPosition', model: DownLineBinaryPosition }
            ]
        });
    }

    /**
     * Upgrades a distributor to his next level.
     * @param {DistributorData} distributor the distributor to upgrade level
     * @param {SequelizeTransaction} transaction a sequelize transaction ACID
     */
    static async upgradeDistributorToNextStage(distributor, transaction = null) {
        const nextLevel = await DistributorLevel.findOne({
            where: { number: distributor.stage.number + 1 },
            transaction: transaction
        });

        return Distributor.update({
            distributorLevelId: nextLevel.id
        }, {
            where: { username: distributor.username },
            transaction: transaction
        })
        .then(() => Distributor.findByPk( distributor.username, {transaction: transaction}))
    }

    /**
     * Finds and returns a distributor's next level
     * @param {String} username the distributor's username
     * @param {SequelizeTransaction} transaction a transaction for ACID
     */
    static async findDistributorNextLevel(username, transaction = null) {
        const distributor = await Distributor.findByPk(username, {
            transaction: transaction
        });

        return DistributorLevelActions.
            findNextLevel(distributor.distributorLevelId, transaction);
    }

    static async getDistributorLevelUpLine(username, levelId, transaction = null) {
        return DistributorLevelGeneration.findOne({
            transaction: transaction,
            where: {
                [Sequelize.Op.and]: [
                    { username: username },
                    { levelId: levelId }
                ]
            },
            include: ['upLine']
        })
        .then(levelDetail => {
            return levelDetail.upLine
        });
    }


    /**
     * Checks if a distributor is in the next level.
     * @param {String} distributorUsername username of the distributor
     * @param {SequelizeTransaction} transaction a transaction object for ACID
     * @returns {Boolean}
     */
    static async isDistributorInNextLevel(distributorUsername, transaction = null) {
        const distributor = await Distributor.findByPk(distributorUsername, {
            transaction: transaction
        });

        const distributorNextLevel = await DistributorLevelActions.
            findNextLevel(distributor.distributorLevelId, transaction);

        const upLineLevel = await UpLineLevelActions
            .findDistributorLevel(distributor.username, distributorNextLevel.id, transaction)

        return upLineLevel ? true : false
    }

    static findDistributorLeaderGeneration(distributorUsername, transaction = null) {
        return Distributor.findByPk(distributorUsername, {
            transaction: transaction,
            where: {
                [Sequelize.Op.and]: [
                    { username: distributorUsername }
                ]
            },
            include: [
                { 
                    model: UpLineLevel, as: 'levels', 
                    where: { levelId: 'leader_stage_2' },
                    include: [
                        { model: UpLineLevelDownLine, as: 'downLines' }
                    ] 
                }
            ]
        });
    }

    static async createDistributorBinaryDownLinePosition(dist2, transaction = null) {
        if (await this.isDistributorLeftDownLineEmpty(dist2.upLineUsername, transaction)) {
            return DownLineBinaryPosition.create({
                position: 'left',
                positionNumber: 0,
                distributorUsername: dist2.username
            }, { transaction: transaction });
        }
        else if (await this.isDistributorRightDownLineEmpty(dist2.upLineUsername, transaction)) {
            return DownLineBinaryPosition.create({
                position: 'right',
                positionNumber: 1,
                distributorUsername: dist2.username
            }, { transaction: transaction });
        } else {
            return Promise.reject({code: 400, msg: "downline_0_space"});
        }
    }

    static findDistributorDirectDownLine(distributorUsername, binaryPosition, transaction = null) {
        return Distributor.findOne({
            transaction: transaction,
            where: {
                [Sequelize.Op.and]: [
                    { upLineUsername: distributorUsername },
                    { "$binaryPosition.position$": binaryPosition }
                ]
            },
            include: ['binaryPosition']
        })
    }

    static async isDistributorLeftDownLineEmpty(distributorUsername, transaction = null) {
        return await this.findDistributorDirectDownLine(
            distributorUsername, 'left', transaction
        ) ? false : true
    }
    
    static async isDistributorRightDownLineEmpty(distributorUsername, transaction = null) {
        return await this.findDistributorDirectDownLine(
            distributorUsername, 'right', transaction
        ) ? false : true
    }

    /**
     * Deducts an amount from a distributor's wallet.
     * @param {String} username the username of the distributor to deduct wallet balance
     * @param {Number} amount the amount to deduct from distributor's wallet
     * @param {SequelizeTransaction} transaction a sequelize transaction to support ACID
     */
    static deductDistributorWallet(username, amount, transaction = null) {
        return DistributorWallet.update({
            balance: sequelize.literal(`balance - ${amount}`)
        }, {
            where: { distributorUsername: username },
            transaction: transaction
        })
    }
}