'use strict';

const BASE_URL  = process.env.BASE_URL;
const { AdminNews, sequelize } = require('../sequelize/models/index');

module.exports = app => {
    app.get(`${BASE_URL}/admin-news/latest`, async (req, res) => {
        try {
            res.send(await AdminNews.findOne({
                where: { isLatest: true }
            }));
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.post(`${BASE_URL}/admin-news`, async (req, res) => {
        const sequelizeTransaction = await sequelize.transaction();

        try {
            await AdminNews.update({
                isLatest: false
            }, { 
                transaction: sequelizeTransaction,
                where: {
                    isLatest: true
                }
            });

            const news = await AdminNews.create({
                message: req.body.message,
                isLatest: true
            }, { transaction: sequelizeTransaction });

            res.send(news);
            sequelizeTransaction.commit();
        } catch(error) {
            sequelizeTransaction.rollback();
            res.sendStatus(500);
            console.error(error);
        }
    });
}