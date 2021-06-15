'use strict';

const { 
    AdminNews
} = require('../sequelize/models/index');
const bcryptjs = require('bcryptjs');

module.exports = class AdminNewsController {
    static async fetchAll(req, res) {
        try {
            const news = await AdminNews.findAll({
                order: [['createdAt', 'DESC']]
            });

            res.send(news);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async fetchLatestNews(req, res) {
        try {
            const news = await AdminNews.findOne({
                where: { isLatest: true }
            });

            res.send(news);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }
}