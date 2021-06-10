'use strict';

const {
    Message
} = require('../sequelize/models');

module.exports = class MessageController {
    static async fetchMessage(req, res) {
        try {
            const message = await Message.findByPk(req.params.id, {
                include: ['sender', 'receiver']
            });

            res.send(message);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async fetchDistributorSentMessages(req, res) {
        try {
            const messages = await Message.findAll({
                where: {
                    senderUsername: req.params.username
                },
                include: ['sender']
            });

            res.send(messages);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }
    
    static async fetchDistributorReceivedMessages(req, res) {
        try {
            const messages = await Message.findAll({
                where: {
                    receiverUsername: req.params.username
                },
                include: ['sender']
            });

            res.send(messages);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async createMessage(req, res) {

    }
}