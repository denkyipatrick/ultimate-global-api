'use strict';

const { 
    Admin, 
    WalletTransaction, 
    DistributorWallet, 
    Distributor,
    Message,
    DistributorLevelGeneration,
    Sequelize, 
    sequelize
} = require('../sequelize/models/index');
const bcryptjs = require('bcryptjs');

module.exports = class AdminController {
    static async dashboardData(req, res) {
        try {
            const distributor = await DistributorLevelGeneration.findOne({
                where: {
                    username: 'admin',
                    levelId: process.env.STAGE_1_ID
                },
                include: ['downLines']
            });

            const wallet = await DistributorWallet.findOne({
                where: {
                    distributorUsername: 'admin'
                }
            });

            const unViewedMessages = await Message.findAll({
                where: {
                    isViewed: false
                },
                include: ['sender']
            });

            const leftDownLine = distributor.downLines.length && distributor.downLines[0];
            const rightDownLine = distributor.downLines.length && distributor.downLines[1];

            async function getTeamCount(username) {
                return await sequelize.query(`
                    with recursive generations(id, parentId, username) as (
                        select id, parentId, username
                        from DistributorLevelGenerations where username = '${username}' 
                        and levelId = '${process.env.STAGE_1_ID}' 
                        union all 
                        select d.id, d.parentId, d.username from DistributorLevelGenerations d 
                        inner join generations d2 
                        on d.parentId = d2.id 
                        where levelId = '${process.env.STAGE_1_ID}'
                    )
                    select id, parentId, username from generations`);
            }

            const leftTeamCount = await getTeamCount(leftDownLine.username);
            const rightTeamCount = await getTeamCount(rightDownLine.username);

            const ds = await Distributor.count();
            res.send({
                wallet: wallet,
                totalMembers: ds,
                unViewedMessages: unViewedMessages,
                totalLeftMembers: leftTeamCount.length,
                totalRightMembers: rightTeamCount.length
            });
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }
}