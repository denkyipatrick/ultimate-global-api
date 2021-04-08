const DistributorActions = require("../classes/action/distributor.action");
const DistributorWalletActions = require("../classes/action/distributorwallet.action");
const TransferTransactionActions = require("../classes/action/transfertransaction.action");
const WalletTransactionActions = require("../classes/action/wallettransaction.action");
const TransferTransactionData = require("../classes/data/transfertransaction.data");
const WalletTransactionData = require("../classes/data/wallettransaction.data");
const { sequelize } = require('../sequelize/models/index');

module.exports = app => {
    app.post('/api/wallettransactions', async (req, res) => {
        console.log(req.body);
        let sequelizeTransaction = null;

        try {
            let walletTransaction = null;
            sequelizeTransaction = await sequelize.transaction();

            const distributorWallet = await DistributorWalletActions
                .findOne(req.body.walletId, sequelizeTransaction);

            switch(req.body.type.toLowerCase()) {
                case 'transfer': {
                    walletTransaction = await WalletTransactionActions.create(
                        new WalletTransactionData(
                            null, distributorWallet.id, +req.body.amount, req.body.type, true), 
                        sequelizeTransaction
                    );

                    const transfer = await TransferTransactionActions.create(
                        new TransferTransactionData(null, 
                            walletTransaction.id,
                            distributorWallet.distributorUsername,
                            req.body.transferReceiverUsername
                        ),
                        sequelizeTransaction
                    );

                    const receiverWallet = await DistributorActions
                        .findDistributorWallet(req.body.transferReceiverUsername, sequelizeTransaction);

                    const receiverTransaction = await WalletTransactionActions.create(
                        new WalletTransactionData(
                            null, receiverWallet.id, +req.body.amount, 'deposit', true
                        ), sequelizeTransaction
                    );

                    await DistributorWalletActions
                        .credit(receiverTransaction, sequelizeTransaction);

                    walletTransaction.setDataValue('transfer', transfer);
                    break;
                }
                case 'deposit': 
                case 'withdrawal': {
                    walletTransaction = await WalletTransactionActions.create(
                        new WalletTransactionData(null, req.body.walletId, 
                            +req.body.amount, req.body.type),
                        sequelizeTransaction
                    );
                    break;
                }
                default: {
                }
            }
            
            console.log(walletTransaction);
            sequelizeTransaction.commit();
            res.status(201).send(walletTransaction);
        } catch(error) {
            res.sendStatus(500);
            sequelizeTransaction.rollback();
            console.error(error);
        }     
    });

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