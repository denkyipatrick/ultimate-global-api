
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

    app.post(`${BASE_URL}/messages`, controller.MessageController.createMessage);

    app.patch(`${BASE_URL}/messages/:messageId/set-as-viewed`,
        controller.MessageController.turnToViewed);
}