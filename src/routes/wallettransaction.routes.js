const DistributorWalletActions = require("../classes/action/distributorwallet.action");
const WalletTransactionActions = require("../classes/action/wallettransaction.action");
const { sequelize, Sequelize } = require('../sequelize/models/index');

const controllers = require('../controller/index');
const validators = require('../validators/wallettransaction.validator');

module.exports = app => {

    app.post('/api/wallettransactions/deposit',
    controllers.WalletTransactionController.newDepositTransaction);

    app.post('/api/wallettransactions/withdraw',
    validators.withdrawTransactionValidators,
    controllers.WalletTransactionController.newWithdrawTransaction);

    app.post('/api/wallettransactions/transfer',
    controllers.WalletTransactionController.newTransferTransaction);

    app.put('/api/wallettransactions/:id', async (req, res) => {
        let sequelizeTransaction = await sequelize.transaction();
        try {
            const walletTransaction = await WalletTransactionActions.findOne(req.params.id);
            let processedTransaction = null;

            if (req.query.type == 'credit') {
                processedTransaction = await DistributorWalletActions
                    .credit(walletTransaction, sequelizeTransaction);
            }
            
            if (req.query.type == 'debit') {
                processedTransaction = await DistributorWalletActions
                    .debit(walletTransaction, sequelizeTransaction);
            }

            res.send(processedTransaction);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
            sequelizeTransaction.rollback();
        }
    });
}