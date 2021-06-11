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
            city: distributor.city,
            country: distributor.country,
            password: distributor.password,
            username: distributor.username,
            lastName: distributor.lastName,
            firstName: distributor.firstName,
            phoneNumber: distributor.phoneNumber,
            distributorLevelId: "starter_stage_1",
            emailAddress: distributor.emailAddress,
            upLineUsername: distributor.upLineUsername,
            sponsorUsername: distributor.sponsorUsername
        }, {
            transaction: sequelizeTransaction
        });
    }

    /**
     * 
     * @param {String} username the username of the target distributor
     * @param {String} firstName the new first name to store
     * @param {String} lastName the new last name to store
     * @param {SequelizeTransaction} sequelizeTransaction a transaction object for ACID
     * @returns a new distributor model instance.
     */
    static changeName(username, firstName, lastName, sequelizeTransaction = null) {
        return Distributor.update({
            firstName: firstName,
            lastName: lastName
        }, {
            transaction: sequelizeTransaction,
            where: { username: username }
        }).then(() => Distributor.findByPk(username, { transaction: sequelizeTransaction }));
    }

    
    /**
     * 
     * @param {String} username the username of the target distributor
     * @param {String} password an encrypted password to store
     * @param {SequelizeTransaction} sequelizeTransaction a transaction object for ACID
     * @returns a new distributor model instance.
     */
     static changePassword(username, password, sequelizeTransaction = null) {
        return Distributor.update({
            password: password
        }, {
            transaction: sequelizeTransaction,
            where: { username: username }
        }).then(() => Distributor.findByPk(username, { transaction: sequelizeTransaction }));
    }

    static findDistributor(username, transaction = null) {
        return Distributor.findByPk(username, {
            transaction: transaction
        });
    }

    static findDistributorWallet(username, transaction = null) {
        return DistributorWallet.findOne({
            transaction: transaction,
            where: {
                distributorUsername: username
            }
        });
    }

    static findDistributorWithWallet(username, transaction = null) {
        return Distributor.findByPk(username, {
            transaction: transaction,
            include: ['wallet', 'stage', 'sponsor']
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
     * Determines whether a distributor qualifies for the next level.
     * @param {DistributorLevelGeneration} distributorLevelGeneration 
     * @returns boolean
     */
    // static async doesDistributorQualifyForNextLevel(distributorLevelGeneration) {
    //     let result = true;

    //     if (distributorLevelGeneration.levelId === 'starter_stage_1') {
    //         for (const downLine of distributorLevelGeneration.downLines) {
    //             if (downLine.downLines.length != 2) {
    //                 result = false;
    //                 break;
    //             }
    //         }
    //     } else {
    //         let breakFromOuterLoop = false;

    //         for (const downLine of distributorLevelGeneration.downLines) {
    //             if (downLine.downLines && downLine.downLines.length < 2 || breakFromOuterLoop) {
    //                 result = false;
    //                 break;
    //             }

    //             for(const secondLevelDownLine of downLine.downLines) {
    //                 if (secondLevelDownLine.downLines && secondLevelDownLine.downLines.length < 2 || breakFromOuterLoop) {
    //                     result = false;
    //                     breakFromOuterLoop = true;
    //                     break;
    //                 }

    //                 for (const thirdLevelDownLine of secondLevelDownLine.downLines) {
    //                     if (thirdLevelDownLine.downLines && thirdLevelDownLine.downLines.length < 2) {
    //                         result = false;
    //                         breakFromOuterLoop = true;
    //                         break;
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     return result;
    // }
    
    /**
     * Determines whether a distributor qualifies for the next level.
     * @param {string} username 
     * @returns boolean
     */
     static async doesDistributorQualifyForNextLevel(username, currentLevelId, sequelizeTransaction = null) {
        let result = true;

        const distributorLevelGeneration = await this.findDistributorLevelGeneration(
            username, currentLevelId, sequelizeTransaction);

        if (distributorLevelGeneration.levelId === 'starter_stage_1') {
            for (const downLine of distributorLevelGeneration.downLines) {
                if (downLine.downLines.length != 2) {
                    result = false;
                    break;
                }
            }
        } else {
            let breakFromOuterLoop = false;

            for (const downLine of distributorLevelGeneration.downLines) {
                if (downLine.downLines && downLine.downLines.length < 2 || breakFromOuterLoop) {
                    result = false;
                    break;
                }

                for(const secondLevelDownLine of downLine.downLines) {
                    if (secondLevelDownLine.downLines && secondLevelDownLine.downLines.length < 2 || breakFromOuterLoop) {
                        result = false;
                        breakFromOuterLoop = true;
                        break;
                    }

                    for (const thirdLevelDownLine of secondLevelDownLine.downLines) {
                        if (thirdLevelDownLine.downLines && thirdLevelDownLine.downLines.length < 2) {
                            result = false;
                            breakFromOuterLoop = true;
                            break;
                        }
                    }
                }
            }
        }

        return result;
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

    static async getDistributorTeamCount(username, levelId, transaction = null) {
        return await sequelize.query(`
        with recursive generations(id, parentId, username) as (
            select id, parentId, username
            from DistributorLevelGenerations where username = '${username}' 
            and levelId = '${levelId}'
            union all 
            select d.id, d.parentId, d.username from DistributorLevelGenerations d 
            inner join generations d2 
            on d.parentId = d2.id 
            where levelId = '${levelId}'
        )
        select id, parentId, username from generations`, {
            transaction: transaction
        });
    }

    static findDistributorTotalLeftCount(username, levelId, transaction = null) {
        return 
    }

    static findDistributorTotalRightCount(username, levelId, transaction = null) {

    }

    static findDistributorLevelGeneration(username, levelId, transaction = null) {
        if (levelId === 'starter_level_1') {
            return DistributorLevelGeneration.findOne({
                where: {
                    [Sequelize.Op.and]: [
                        { levelId: levelId },
                        { username: username }
                    ]
                },
                include: [
                    { model: Distributor, as: 'distributor', include: ['stage'] },
                    { 
                        model: DistributorLevelGeneration, 
                        as: 'downLines',
                        order: [['position', 'ASC']],
                        include: [
                            { model: Distributor, as: 'distributor', include: ['stage'] },
                            { 
                                model: DistributorLevelGeneration, 
                                as: 'downLines', 
                                order: [['position', 'ASC']], 
                                include: [{ model: Distributor, as: 'distributor', include: ['stage'] },]
                            }
                        ]
                    }
                ]
            });
        }

        return DistributorLevelGeneration.findOne({
            transaction: transaction,
            where: {
                [Sequelize.Op.and]: [
                    { levelId: levelId },
                    { username: username }
                ]
            },
            include: [
                { model: Distributor, as: 'distributor', include: ['stage'] },
                { 
                    model: DistributorLevelGeneration,
                    as: 'downLines',
                    order: [['createdAt', 'ASC']],
                    include: [
                        { model: Distributor, as: 'distributor', include: ['stage'] },
                        { 
                            model: DistributorLevelGeneration,
                            as: 'downLines',
                            order: [['createdAt', 'ASC']],
                            include: [
                                { model: Distributor, as: 'distributor', include: ['stage'] },
                                { model: DistributorLevelGeneration,
                                    as: 'downLines',
                                    order: [['createdAt', 'ASC']],
                                    include: [
                                        { model: Distributor, as: 'distributor', include: ['stage'] },
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }

    static async isDistributorAlreadyInLevel(username, levelId, transaction = null) {
        return await this.findDistributorLevelGeneration(
            username,
            levelId,
            transaction) ?
            true : false
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