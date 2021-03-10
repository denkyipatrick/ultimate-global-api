const DistributorActions = require("../classes/action/distributor.action");
const DistributorLevelActions = require("../classes/action/distributorlevel.action");
const DistributorLevelGenerationActions = require("../classes/action/distributorlevelgeneration.action");
const DistributorWalletActions = require("../classes/action/distributorwallet.action");
const DistributorData = require("../classes/data/distributor.data");
const DistributorLevelGenerationData = require("../classes/data/distributorlevelgeneration.data");
const DistributorWalletData = require("../classes/data/distributorwallet.dataclass");
const { sequelize, Sequelize, Distributor, DistributorLevelGeneration,
    UpLineLevel, UpLineLevelDownLine } = require("../sequelize/models");

module.exports = app => {
    const BASE_URL = process.env.BASE_URL;

    app.get(`${BASE_URL}/distributors`, async (req, res) => {        
    });

    app.get(`${BASE_URL}/distributors/:username/generations/:stage`, async (req, res) => {
        console.log(req.params);
        try {
            let generation = null;

            switch(req.params.stage) {
                case 'starter': {
                    generation = await DistributorLevelGeneration.findOne({
                        where: {
                            [Sequelize.Op.and]: [
                                { levelId: 'starter_stage_1' },
                                { username: req.params.username }
                            ]
                        },
                        order: [['createdAt', 'ASC']],
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
                                        include: [{ model: Distributor, as: 'distributor', include: ['stage'] },]
                                    }
                                ]
                            }
                        ]
                    });
                    break;
                }
                case 'leader': {
                    // generation = await DistributorActions.
                    //     findDistributorLeaderGeneration(req.params.username)

                    generation = await DistributorLevelGeneration.findOne({
                        where: {
                            [Sequelize.Op.and]: [
                                { levelId: 'leader_stage_2' },
                                { username: req.params.username }
                            ]
                        },
                        include: [
                            { model: Distributor, as: 'distributor', include: ['stage'] },
                            { model: DistributorLevelGeneration, as: 'downLines', include: [
                                { model: Distributor, as: 'distributor', include: ['stage'] },
                                { model: DistributorLevelGeneration, as: 'downLines', include: [
                                    { model: Distributor, as: 'distributor', include: ['stage'] },
                                    { model: DistributorLevelGeneration, as: 'downLines', include: [
                                        { model: Distributor, as: 'distributor', include: ['stage'] },
                                    ] }
                                ] }
                            ]}
                        ]
                    })
                    break;
                }
                case 'ruby': {
                    break;
                }
                default: {
                }
            }

            // console.log(generation);
            res.send(generation);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    })

    app.post(`${BASE_URL}/distributors`, async (req, res) => {
        console.log(req.body);
        let transaction = null;
        // return res.send();

        try {
            const STARTER_STAGE_ID = "starter_stage_1";
            transaction = await sequelize.transaction();
            
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

            let downLinePosition = null;

            if (!await DistributorLevelGeneration.findOne({
                transaction: transaction,
                where: {
                    [Sequelize.Op.and]: [
                        { upLineUsername: req.body.upLineUsername },
                        { position: 'left' },
                        { levelId: STARTER_STAGE_ID  }
                    ]
                }
            })) {
                downLinePosition = 'left';
            } else if (!await DistributorLevelGeneration.findOne({
                transaction: transaction,
                where: {
                    [Sequelize.Op.and]: [
                        { upLineUsername: req.body.upLineUsername },
                        { position: 'right' },
                        { levelId: STARTER_STAGE_ID  }
                    ]
                }
            })) {
                downLinePosition = 'right';
            } else {
                res.status(500).send('left_right_occupied');
                throw "lef_right_occupied";
            }

            const distributorUpLineStarterStageRecord = await DistributorLevelGeneration.findOne({
                transaction: transaction,
                where: { 
                    [Sequelize.Op.and]: [
                        { levelId: STARTER_STAGE_ID },
                        { username: req.body.upLineUsername }
                    ]
                 }
            });

            // const distributorStarterGeneration = 
            await DistributorLevelGeneration.create({
                parentId: distributorUpLineStarterStageRecord.id, 
                levelId: STARTER_STAGE_ID,
                position: downLinePosition,
                username: createdDistributor.username,
                upLineUsername: req.body.upLineUsername
            }, { transaction: transaction });

            const FIVE_DOLLARS = 5;

            createdDistributor.setDataValue('wallet', await DistributorWalletActions.create(
                new DistributorWalletData(createdDistributor.username, FIVE_DOLLARS), transaction));

            await DistributorActions.deductDistributorWallet(
                createdDistributor.sponsorUsername, FIVE_DOLLARS, transaction);
                
            let secondUpUpLine = null;

            if (downLinePosition == 'right') {
                const distributorSecondUpUpLineStarterGeneration = 
                    await DistributorLevelGeneration.findOne({
                        transaction: transaction,
                        where: { 
                            [Sequelize.Op.and]: [
                                { levelId: STARTER_STAGE_ID },
                                { username: distributorUpLineStarterStageRecord.upLineUsername }
                            ]
                        },
                        include: [
                            { model: Distributor, as: 'upLine', include: ['stage'] },
                            { model: Distributor, as: 'distributor', include: ['stage'] },
                            { model: DistributorLevelGeneration, as: 'downLines', include: [
                                { model: DistributorLevelGeneration, as: 'downLines' }
                            ] }
                        ]
                    });

                const upLineToUpgrade = distributorSecondUpUpLineStarterGeneration;

                // console.log('secondUpUpLine',upLineToUpgrade);

                if (upLineToUpgrade && upLineToUpgrade.downLines.length == 2) {
                    let shouldUpgradeUpLineLevel = true;

                    for (let downLine of upLineToUpgrade.downLines) {
                        if (downLine.downLines.length != 2) {
                            shouldUpgradeUpLineLevel = false;
                            console.log('we will not upgrade, down lines not upto six')
                            break;
                        }
                    }

                    if (shouldUpgradeUpLineLevel) {
                        console.log(`${upLineToUpgrade.username} should be upgraded`);
                        
                        await DistributorActions.upgradeDistributorToNextStage(
                            upLineToUpgrade.distributor, transaction);

                        // find appropriate place to put upgraded distributor in the next 
                        // stage.

                        let keepLooping = true;
                        let CURRENT_LEVEL_ID = STARTER_STAGE_ID;
                        let nextLevel = await DistributorLevelActions
                            .findNextLevel(STARTER_STAGE_ID, transaction)
                        
                        // assume it's upgraded distributor's upLine
                        let nextLevelUpLine = upLineToUpgrade.upLine

                        console.log("upgraded upline's upLine", nextLevelUpLine)
                        // console.log(nextLevel);

                        while(keepLooping) {
                            if (nextLevelUpLine == null) {
                                console.log('move up line to next level now with no up line or parent.')
                                keepLooping = false;
                                
                                await DistributorLevelGeneration.create({
                                    // parentId: distributorUpLineStarterStageRecord.id, 
                                    levelId: nextLevel.id,
                                    position: 'none',
                                    username: upLineToUpgrade.username
                                    // upLineUsername: req.body.upLineUsername
                                }, { transaction: transaction });
                            } else {
                                console.log(nextLevelUpLine.username + ' is available ', nextLevelUpLine.distributorLevelId)

                                // check if this upLine is in next level.
                                if (nextLevelUpLine.distributorLevelId == nextLevel.id) {
                                    console.log('distributor is in stage ' + nextLevel.id)
                                    console.log(nextLevelUpLine.username + ' is in next level')

                                    let nextLevelPosition = null;
                                    const LEFT_BINARY_POSITION = "left";
                                    const RIGHT_BINARY_POSITION = "right";

                                    if (!await DistributorLevelGenerationActions
                                        .doesDistributorHaveLevelDirectChild(
                                            nextLevelUpLine.username, 
                                            nextLevel.id, LEFT_BINARY_POSITION, transaction)) {
                                        nextLevelPosition = LEFT_BINARY_POSITION;
                                        console.log('does not have a left child');
                                    } else if (!await DistributorLevelGenerationActions.
                                        doesDistributorHaveLevelDirectChild(nextLevelUpLine.username,
                                            nextLevel.id, RIGHT_BINARY_POSITION, transaction)) {
                                        nextLevelPosition = RIGHT_BINARY_POSITION;
                                        console.log('does not have a right child');
                                    } else {
                                        console.log('up line has both sides.')
                                        // find the left child of distributor

                                        // find next 
                                        const downLines = await DistributorLevelGeneration.findAll({
                                            transaction: transaction,
                                            where: {
                                                [Sequelize.Op.and]: [
                                                    { levelId: nextLevel.id },
                                                    { upLineUsername: nextLevelUpLine.username }
                                                ]
                                            },
                                            include: ['distributor']
                                        });

                                        let nextDownLines = [];

                                        for (const downLine of downLines) {
                                            console.log('downline', downLine);

                                            if (!await DistributorLevelGenerationActions.hasLeftChild(
                                                downLine.username, nextLevel.id, transaction ) || 
                                                !await DistributorLevelGenerationActions.hasRightChild(
                                                downLine.username, nextLevel.id, transaction)) {
                                                console.log(downLine.username + ' has no left or right child');
                                                nextLevelUpLine = downLine.distributor;
                                                nextDownLines = [];
                                                break;
                                            } 
                                            // else if (! await DistributorLevelGenerationActions
                                            //     .doesDistributorHaveLevelDirectChild(
                                            //         downLine.username, nextLevel.id, 'right', transaction)) {
                                            //     console.log(downLine.username + ' has no right child');
                                            //     nextLevelUpLine = downLine;
                                            // }
                                            else {
                                                console.log(downLine.username + ' has no child');
                                                nextDownLines.push(downLine.username);
                                            }
                                        }

                                        if (nextDownLines.length == 0) {
                                            console.log('we are going up with upline ', nextLevelUpLine);
                                            continue;
                                        }

                                        console.log(nextDownLines);
                                        // console.log('up line down lines', downLines);
                                        // continue
                                        break;
                                    }
                                    
                                    const currentUpLineNextStageRecord = await DistributorLevelGeneration
                                        .findOne({
                                        transaction: transaction,
                                        where: { 
                                            [Sequelize.Op.and]: [
                                                { levelId: nextLevel.id },
                                                { username: nextLevelUpLine.username }
                                            ]
                                        }
                                    });

                                    console.log('upline next stage record',  currentUpLineNextStageRecord);
                                    
                                    const levelDownLine = await DistributorLevelGeneration.create({
                                        parentId: currentUpLineNextStageRecord.id, 
                                        levelId: nextLevel.id,
                                        position: nextLevelPosition,
                                        username: upLineToUpgrade.username,
                                        upLineUsername: currentUpLineNextStageRecord.username
                                    }, { transaction: transaction });

                                    console.log(levelDownLine);

                                    if (levelDownLine.position == 'right') {
                                        console.log('this down line is a right child in the next level.');

                                        const upLineToUpgradesUpLine = await DistributorLevelGeneration.findOne({
                                            transaction: transaction,
                                            where: {
                                                levelId: nextLevel.id,
                                                username:  currentUpLineNextStageRecord.upLineUsername
                                            }
                                        });

                                        console.log(upLineToUpgradesUpLine.upLineUsername);

                                        if (upLineToUpgradesUpLine) {
                                            const downs = await DistributorLevelGeneration.findOne({
                                                transaction: transaction,
                                                where: {
                                                    levelId: nextLevel.id,
                                                    username: upLineToUpgradesUpLine.upLineUsername
                                                },
                                                include: [
                                                    { 
                                                        model: DistributorLevelGeneration, 
                                                        as: 'downLines',
                                                        include: [
                                                            {
                                                                model: DistributorLevelGeneration, 
                                                                as: 'downLines',
                                                                include: [
                                                                    {
                                                                        model: DistributorLevelGeneration, 
                                                                        as: 'downLines'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            });

                                            console.log(downs);

                                            let totalDownLines = 0;
                                            
                                            for (let d of downs.downLines) {
                                                totalDownLines++;
                                                console.log('down line', d.username);
                                                
                                                for (let d1 of d.downLines) {
                                                    totalDownLines++;
                                                    totalDownLines += d1.downLines.length;

                                                    console.log('downs ', d1.username);
                                                }
                                            }

                                            console.log(totalDownLines);

                                            if (totalDownLines == 14) {
                                                console.log('upgrade this up line to the next level.')
                                                nextLevel = await DistributorLevelActions.findNextLevel(nextLevel.id, transaction);

                                                keepLooping = true;
                                                continue;
                                            } else {
                                                console.log('you need up to ' + 14 - totalDownLines + ' to qualify' )
                                            }
                                        }
                                    }

                                    // check if this down line is at the right or the up line.
                                    // get the entire level generation of the up line
                                    // loop over them to find out if the up line must be moved to 
                                    // the next level.
                                    // if true, then repeat this whole process to move this up line 
                                    // to another up line's team.
                                } else {
                                    // distributor is not in the next level, find distributor's upline 
                                    // and do the process again.
                                    console.log(nextLevelUpLine.username + 
                                        ' is not in  level ' + nextLevel.id)
                                    // console.log(nextLevelUpLine.username);

                                    const data = 
                                        await DistributorLevelGeneration.findOne({
                                        transaction: transaction,
                                        where: {
                                            [Sequelize.Op.and]: [
                                                { levelId: CURRENT_LEVEL_ID },
                                                { username: nextLevelUpLine.username }
                                            ]
                                        },
                                        include: ['upLine']
                                    });
                                    
                                    console.log(data.upLine);
                                    nextLevelUpLine = data.upLine
                                    continue;
                                }

                                keepLooping = false;
                            }
                        }
                    } else {
                        console.log('should not upgrade');
                    }
                }
            }

            transaction.rollback();
            // transaction.commit();
            res.status(201).send({dist: createdDistributor, sec: secondUpUpLine});
        } catch(error) {
            transaction.rollback();
            res.status(error.code || 500).send(error.msg);
            console.error(error);
        }
    });
    
    app.post(`${BASE_URL}/distributors/auth`, async (req, res) => {
        try {
            console.log(req.body);
            const distributor = await DistributorActions.findDistributor(req.body.username);
            res.send(distributor);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    })
}