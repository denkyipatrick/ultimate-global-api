
const { 
    Notification
} = require('../sequelize/models/index');
const BASE_URL = `${process.env.BASE_URL}`;

module.exports = app => {
    app.post(`${BASE_URL}/notifications`, async (req, res) => {
        try {
            console.log(req.body);

            const notification = await Notification.create({
                message: req.body.message,
                distributorUsername: req.body.receiverUsername
            });

            res.status(201).send(notification);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
}