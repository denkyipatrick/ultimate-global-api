
const { 
    Message,
    Sequelize, 
    sequelize} = require('../sequelize/models/index');
const BASE_URL = `${process.env.BASE_URL}`;

module.exports = app => {
    app.get(`${BASE_URL}/messages`, async (req, res) => {
        try {
            const messages = await Message.findAll({
                include: ['sender']
            });

            console.log(messages);

            res.send(messages);

        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
    
    app.get(`${BASE_URL}/messages/:id`, async (req, res) => {
        try {
            const message = await Message.findAll({
                include: ['sender'],
                where: { id: req.params.id }
            });

            res.send(message);

        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.post(`${BASE_URL}/messages`, async (req, res) => {
        try {
            console.log(req.body);

            const message = await Message.create({
                text: req.body.text,
                distributorUsername: req.body.senderUsername
            });

            res.status(201).send(message);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
}