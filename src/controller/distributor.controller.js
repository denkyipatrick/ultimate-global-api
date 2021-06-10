'use strict';

const {
    DistributorLevelGeneration
} = require('../sequelize/models/index');
module.exports = class DistributorController {
    static async fetchDirectDownLines(req, res) {
        try {
            const distributor = await DistributorLevelGeneration.findOne({
                where: {
                    username: req.params.username,
                    levelId: process.env.STAGE_1_ID
                },
                include: [
                    {
                        model: DistributorLevelGeneration, as: 'downLines',
                        include: ['distributor']
                    }
                ]
            });
            
            res.send(distributor.downLines);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }
}