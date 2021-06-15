'use strict';

const {
    Message
} = require('../sequelize/models');

module.exports = class MessageController {
    static async fetchMessage(req, res) {
        try {
            const message = await Message.findByPk(req.params.id, {
                include: ['sender', 'receiver'],
                order: [['isViewed', 'ASC'], ['createdAt', 'DESC']]
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
                include: ['sender', 'receiver'],
                order: [['createdAt', 'DESC']]
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
                include: ['sender'],
                order: [['isViewed', 'ASC'], ['createdAt', 'DESC']]
            });

            res.send(messages);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async createMessage(req, res) {
        try {
            const message = await Message.create({
                text: req.body.text || req.body.message,
                senderUsername: req.body.senderUsername || 
                    process.env.SYSTEM_ADAM_ACCOUNT_USERNAME,
                receiverUsername: req.body.receiverUsername || 
                    process.env.SYSTEM_ADAM_ACCOUNT_USERNAME
            });

            res.status(201).send(message);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async turnToViewed(req, res) {
        try {
            const message = await Message.update({
                isViewed: true
            }, {
                where: {
                    id: req.params.messageId
                }
            })
            .then(() => Message.findByPk(req.params.messageId));
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }
}