
const { 
    Message,
    Sequelize, 
    sequelize
} = require('../sequelize/models/index');
const BASE_URL = `${process.env.BASE_URL}`;
const controller = require('../controller/index');

module.exports = app => {
    app.get(`${BASE_URL}/messages`, async (req, res) => {
        try {
            const messages = await Message.findAll({
                include: ['sender']
            });

            res.send(messages);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
    
    app.get(`${BASE_URL}/messages/:id`,
        controller.MessageController.fetchMessage);

    app.post(`${BASE_URL}/messages`, async (req, res) => {
        try {
            console.log(req.body);
            const message = await Message.create({
                text: req.body.text,
                senderUsername: req.body.senderUsername,
                receiverUsername: req.body.receiverUsername || 
                process.env.FIRST_ACCOUNT_USERNAME
            });

            res.status(201).send(message);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
}