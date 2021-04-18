
const { sequelize, DistributorWallet, WalletTransaction } = require('../sequelize/models/index');
const BASE_URL = `${process.env.BASE_URL}/wallets`;
const bcryptjs = require('bcryptjs');

module.exports = app => {
    app.get(`${BASE_URL}/:walletId/transactions`, async (req, res) => {
        try {
            const transactions = await WalletTransaction.findAll({
                where: {
                    distributorWalletId: req.params.walletId
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

    app.patch(`${BASE_URL}/:walletId`, async (req, res) => {
        try {
            const wallet = await DistributorWallet.findByPk(req.params.walletId);

            if (wallet.pin !== bcryptjs.compareSync(req.body.currentPin, wallet.pin)) {
                return res.status(400).send({message: 'wrong_pin'});
            }

            await DistributorWallet.update({
                pin: bcryptjs.hashSync(req.body.newPin, 10)
            }, {
                where: { id: wallet.id }
            })
            .then(() => DistributorWallet.findByPk(wallet.id));

            res.send(wallet);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
}