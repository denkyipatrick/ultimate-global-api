const DistributorActions = require("../classes/action/distributor.action");
const DistributorLevelActions = require("../classes/action/distributorlevel.action");
const DistributorLevelGenerationActions = require("../classes/action/distributorlevelgeneration.action");
const DistributorWalletActions = require("../classes/action/distributorwallet.action");
const DistributorData = require("../classes/data/distributor.data");
const DistributorLevelGenerationData = require("../classes/data/distributorlevelgeneration.data");
const DistributorWalletData = require("../classes/data/distributorwallet.dataclass");
const { 
    sequelize,
    Sequelize,
    Notification,
    Distributor,
    AdminNews,
    DistributorWallet,
    DistributorLevel,
    DistributorLevelGeneration 
} = require("../sequelize/models");

const bcryptjs = require('bcryptjs');

module.exports = app => {
    const BASE_URL = process.env.BASE_URL;

    app.get(`${BASE_URL}/distributors`, async (req, res) => {
        res.send(await Distributor.findAll());
    });
    
    app.get(`${BASE_URL}/distributors/:username`, async (req, res) => {
        res.send(await Distributor.findOne({
            where: { username: req.params.username },
            include: [
                'wallet', 'stage'
            ]
        }));
    });
    
    app.get(`${BASE_URL}/distributors/:username/notifications`, async (req, res) => {
        try {
            const notifications = await Notification.findAll({
                where: {
                    distributorUsername: req.params.username
                },
                order: [['createdAt', 'DESC']]
            });

            res.send(notifications);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.get(`${BASE_URL}/distributors/:username/generations/:stage`, async (req, res) => {
        console.log(req.params);
        try {
            let generation = null;

            switch(req.params.stage) {
                case 'starter': {
                    generation = await DistributorActions.findDistributorLevelGeneration(
                        req.params.username, 'starter_stage_1'
                    );
                    break;
                }
                case 'leader': {
                    generation = await DistributorActions.findDistributorLevelGeneration(
                        req.params.username, 'leader_stage_2'
                    );
                    break;
                }
                case 'ruby': {
                    generation = await DistributorActions.findDistributorLevelGeneration(
                        req.params.username, 'ruby_stage_3'
                    );
                    break;
                }
                case 'emerald': {
                    generation = await DistributorActions.findDistributorLevelGeneration(
                        req.params.username, 'emerald_stage_4'
                    );
                    break;
                }
                case 'diamond': {
                    generation = await DistributorActions.findDistributorLevelGeneration(
                        req.params.username, 'diamond_stage_5'
                    );
                    break;
                }
                default: {
                }
            }
            
            res.send(generation);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.post(`${BASE_URL}/distributors`, createDistributor);
    
    app.post(`${BASE_URL}/distributors/auth`, async (req, res) => {
        try {
            const distributor = await DistributorActions
                .findDistributorWithWallet(req.body.username);

            const news = await AdminNews.findOne({
                where: { isLatest: true }
            });

            res.send({distributor: distributor, latestNews: news});
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
    
    app.patch(`${BASE_URL}/distributors/:username/change-address-details`, async (req, res) => {
        console.log(req.body);
        try {
            const distributor = await Distributor.update({
                city: req.body.city,
                country: req.body.country
            }, {
                where: { username: req.params.username }
            })
            .then(() => Distributor.findByPk(req.params.username));

            res.send(distributor);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
    
    app.patch(`${BASE_URL}/distributors/:username/change-contact-details`, async (req, res) => {
        try {
            const distributor = await Distributor.update({
                phoneNumber: req.body.phoneNumber,
                emailAddress: req.body.emailAddress
            }, {
                where: { username: req.params.username }
            })
            .then(() => Distributor.findByPk(req.params.username));
            res.send(distributor);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
    
    app.patch(`${BASE_URL}/distributors/:username/change-next-of-kin`, async (req, res) => {
        try {

        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.patch(`${BASE_URL}/distributors/:username/change-bank-details`, async (req, res) => {
        try {
            const distributor = await Distributor.update({
                bankName: req.body.bankName,
                swiftCode: req.body.swiftCode,
                accountNumber: req.body.accountNumber
            }, {
                where: { username: req.params.username }
            })
            .then(() => Distributor.findByPk(req.params.username));
            
            res.send(distributor);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.patch(`${BASE_URL}/distributors/:username/change-name`, async (req, res) => {
        try {
            const distributor = await DistributorActions.changeName(
                req.params.username,
                req.body.firstName,
                req.body.lastName
            );

            res.send(distributor);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.patch(`${BASE_URL}/distributors/:username/change-password`, async (req, res) => {
        try {
            const distributor = await DistributorActions.changePassword(
                req.params.username,
                bcryptjs.hashSync(req.body.newPassword, 10)
            );

            res.send(distributor);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
}

async function addUpLineIncentive(downLineUsername, levelId, transaction = null) {
    console.log('adding incentive');
    const usernames = [];

    const level = await DistributorLevel
        .findByPk(levelId, { transaction: transaction });

    if (level.id === 'starter_stage_1') {
        console.log('stage 1');
        const upLine = await DistributorLevelGeneration.findOne({
            transaction: transaction,
            where: {
                levelId: level.id,
                username: downLineUsername
            },
            include: [
                { model: DistributorLevelGeneration, as: 'parent', include: ['parent'] }
            ]
        });

        if (upLine) {
            usernames.push(
                upLine.parent &&
                upLine.parent.username);

            usernames.push(
                upLine.parent &&
                upLine.parent.parent &&
                upLine.parent.parent.username);
        }

        // console.log(upLine);
    } else {
        console.log('stage other');
        const upLine = await DistributorLevelGeneration.findOne({
            transaction: transaction,
            where: {
                levelId: level.id,
                username: downLineUsername
            },
            include: [
                { model: DistributorLevelGeneration, as: 'parent', include: [
                    { model: DistributorLevelGeneration, as: 'parent', include: ['parent'] }
                ] }
            ]
        });

        if (upLine) {
            usernames.push(
                upLine.parent &&
                upLine.parent.username);

            usernames.push(
                upLine.parent &&
                upLine.parent.parent &&
                upLine.parent.parent.username);

            usernames.push(
                upLine.parent &&
                upLine.parent.parent &&
                upLine.parent.parent.parent &&
                upLine.parent.parent.parent.username);
        }
    }

    await DistributorWallet.update({
        balance: Sequelize.literal(`balance + ${level.incentiveAmount}`)
    }, {
        transaction: transaction,
        where: {
            distributorUsername: {
                [Sequelize.Op.in]: usernames
            }
        }
    });

    console.log(usernames, level.incentiveAmount);
}

async function createDistributor(req, res) {
    let transaction = await sequelize.transaction();
    console.log(req.body);

    try {
        const STARTER_STAGE_ID = "starter_stage_1";
        let CURRENT_LEVEL_ID = STARTER_STAGE_ID;
        
        const createdDistributor = await DistributorActions.createDistributor(
            new DistributorData(
                req.body.username, 
                req.body.password,
                req.body.lastName,
                req.body.firstName,
                req.body.phoneNumber,
                req.body.sponsorUsername, 
                req.body.upLineUsername),
            transaction
        );
        
        const TEN_DOLLARS = 10;

        const distributorWallet = await DistributorWalletActions.create(
            new DistributorWalletData(createdDistributor.username, TEN_DOLLARS), transaction);

        createdDistributor.setDataValue('wallet', distributorWallet);

        await DistributorActions.deductDistributorWallet(
            createdDistributor.sponsorUsername, TEN_DOLLARS, transaction);

        let newDownLine = await DistributorLevelGenerationActions
            .createLevelDownLine(req.body.upLineUsername, 
                createdDistributor.username, STARTER_STAGE_ID, transaction);

        console.log('has passed beginning');

        while(true) {
            await addUpLineIncentive(newDownLine.username, CURRENT_LEVEL_ID, transaction);

            let upLineToUpgrade = null;
            let nextLevel = await DistributorLevelActions
                .findNextLevel(CURRENT_LEVEL_ID, transaction);

            if (CURRENT_LEVEL_ID === STARTER_STAGE_ID) {
                console.log('Level 1');
                upLineToUpgrade = await DistributorLevelGenerationActions
                    .findDistributorLevelUpLine(
                        newDownLine.upLineUsername,
                        CURRENT_LEVEL_ID,
                        transaction);
            } else {
                console.log('Not Level 1');
                const distUpLineToUpgrade = await DistributorLevelGenerationActions
                    .findDistributorLevelUpLine(
                        newDownLine.upLineUsername,
                        CURRENT_LEVEL_ID,
                        transaction);

                console.log('between', distUpLineToUpgrade.username,distUpLineToUpgrade.upLineUsername);

                upLineToUpgrade = await DistributorLevelGenerationActions
                    .findDistributorLevelUpLine(
                        distUpLineToUpgrade.username,
                        CURRENT_LEVEL_ID,
                        transaction);
            }

            if (!upLineToUpgrade) { break; }

            if (!await DistributorActions.doesDistributorQualifyForNextLevel(
                upLineToUpgrade.username,
                CURRENT_LEVEL_ID,
                transaction
            )) {
                console.log(upLineToUpgrade.username, 'does not qualify for the next level.');
                break;
            }
            
            if (await DistributorActions.isDistributorAlreadyInLevel(
                upLineToUpgrade.username,
                nextLevel.id,
                transaction)) {
                console.log('already in next level');
                break;
            }
            
            const nextStageUpLine = await DistributorLevelGenerationActions
                .findDistributorNextLevelUpLine(
                    upLineToUpgrade.username,
                    nextLevel.id,
                    transaction
                );

            console.log('nextStageUpLine', nextStageUpLine.username);
            // find the best position to place upLineToUpgrade
            // save upLineToUpgrade under the found upLine into newDownLine
            // continue with the loop
            const nextStageUpLineLevelGeneration = await DistributorActions
            .findDistributorLevelGeneration(
                nextStageUpLine.username,
                nextLevel.id, transaction);
            
            let newLevelUpLine = null; // find the upLine for the new level.

            if(nextStageUpLineLevelGeneration.downLines.length < 2) {
                newLevelUpLine = nextStageUpLine
            } else {
                console.log(nextStageUpLine.username, ' already has his team.');
                for(const downLine of nextStageUpLineLevelGeneration.downLines) {
                    if (downLine.downLines.length < 2) {
                        newLevelUpLine = downLine;
                        break;
                    }
                }
            }

            console.log('newLevelUpLine', newLevelUpLine.username);

            newDownLine = await DistributorLevelGenerationActions
                .createLevelDownLine(
                    newLevelUpLine.username,
                    upLineToUpgrade.username,
                    nextLevel.id,
                    transaction);

            // console.log('newDownLine', newDownLine);
                
            // Upgrade upLineToUpgrade's current level
            await DistributorActions.upgradeDistributorToNextStage(
                upLineToUpgrade.distributor, transaction
            );

            // console.log('newDownLine', newDownLine);

            if(CURRENT_LEVEL_ID === "infinity_stage_9") {
                break;
            }

            // console.log('next Level', nextLevel);
            CURRENT_LEVEL_ID = nextLevel.id;
        }
        
        transaction.commit();
        // transaction.rollback();
        res.status(201).send(createdDistributor);
    } catch(error) {
        transaction.rollback();
        res.status(error.code || 500).send(error.msg);
        console.error(error);
    }
}