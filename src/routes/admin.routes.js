
const { 
    Admin, 
    WalletTransaction, 
    DistributorWallet, 
    Sequelize, 
    sequelize} = require('../sequelize/models/index');
const BASE_URL = `${process.env.BASE_URL}`;
const bcryptjs = require('bcryptjs');

const controllers = require('../controller/index');

module.exports = app => {
    app.get(`${BASE_URL}/admins`, async (req, res) => {
        try {
            const admins = await Admin.findAll();
            res.send(admins);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.get(`${BASE_URL}/admins/dashboard`,
        controllers.AdminController.dashboardData);

    app.get(`${BASE_URL}/admins/wallet-transactions/deposits`, async (req, res) => {
        try {
            res.send(await WalletTransaction.findAll({
                where: {
                    type: 'deposit',
                    isProcessed: false
                },
                include: {
                    model: DistributorWallet, as: 'wallet', include: ['distributor']
                }
            }));
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.get(`${BASE_URL}/admins/wallet-transactions/withdrawals`, async (req, res) => {
        try {
            res.send(await WalletTransaction.findAll({
                where: {
                    type: 'withdrawal',
                    isProcessed: false
                },
                include: {
                    model: DistributorWallet, as: 'wallet', include: ['distributor']
                }
            }));
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
    
    app.get(`${BASE_URL}/admins/wallet-transactions/:transactionId`, async (req, res) => {
        try {
            res.send(await WalletTransaction.findByPk(req.params.transactionId, {
                include: {
                    model: DistributorWallet, as: 'wallet', include: ['distributor']
                }
            }));
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.patch(`${BASE_URL}/admins/wallet-transactions/` + 
    `:transactionId/set-as-paid`, async (req, res) => {
        const sequelizeTransaction = await sequelize.transaction();

        try {
            const transaction = await WalletTransaction.update({
                isProcessed: true
            }, {
                transaction: sequelizeTransaction,
                where: {
                    id: req.params.transactionId
                }
            }).then(() => WalletTransaction.findByPk(req.params.transactionId, {
                transaction: sequelizeTransaction
            }));

            await DistributorWallet.update({
                balance: Sequelize.literal(`balance - ${transaction.amount}`)
            }, {
                transaction: sequelizeTransaction,
                where: {
                    id: transaction.distributorWalletId
                }
            });

            sequelizeTransaction.commit();
            res.send(transaction)
        } catch(error) {
            sequelizeTransaction.rollback();
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.post(`${BASE_URL}/admins`, async (req, res) => {
        try {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
            const admin = await Admin.create(req.body);
            res.status(201).send(admin);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.post(`${BASE_URL}/admins/auth`, async (req, res) => {
        try {
            const admin = await Admin.findByPk(req.body.username);

            if (!admin) {
                return res.sendStatus(404);
            }

            // if (!bcryptjs.compareSync(req.body.password, admin.password)) {
            //     return res.sendStatus(400);
            // }

            res.send(admin);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });

    app.patch(`${BASE_URL}/admins/:username/change-name`, async (req, res) => {
        try {
            console.log(req.body);
            const admin = await Admin.update({
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }, {
                where: {
                    username: req.params.username
                }
            })
            .then(() => Admin.findByPk(req.params.username));

            res.send(admin);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
    
    app.patch(`${BASE_URL}/admins/:username/change-password`, async (req, res) => {
        try {
            const admin = await Admin.findOne({
                where: {
                    username: req.params.username
                }
            });

            if (!admin) {
                return res.sendStatus(404);
            }

            if (!bcryptjs.compareSync(req.body.newPassword, admin.password)) {
                return res.sendStatus(400);
            }

            await Admin.update({
                password: bcryptjs.hashSync(req.body.newPassword, 10)
            }, {
                where: {
                    username: req.params.username
                }
            });

            res.send();
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
}