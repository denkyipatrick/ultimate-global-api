
const { sequelize, WalletTransaction } = require('../sequelize/models/index');

module.exports = app => {
    app.get('/api/wallets/:id/transactions', async (req, res) => {
        try {
            const transactions = await WalletTransaction.findAll({
                where: {
                    distributorWalletId: req.params.id
                },
                include: ['transfer'],
                order: [['createdAt', 'DESC']]
            });

            res.send(transactions);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
}