'use strict';
const DistributorActions = require("../classes/action/distributor.action");
const DistributorWalletActions = require("../classes/action/distributorwallet.action");
const TransferTransactionActions = require("../classes/action/transfertransaction.action");
const WalletTransactionActions = require("../classes/action/wallettransaction.action");
const TransferTransactionData = require("../classes/data/transfertransaction.data");
const WalletTransactionData = require("../classes/data/wallettransaction.data");
const { DistributorWallet, WalletTransaction, sequelize, Sequelize } = require('../sequelize/models/index');
const { validationResult } = require('express-validator');

module.exports = class WalletTransactionController {
    static async newWithdrawTransaction(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.error(errors);
            return res.status(400).send(errors);
        }

        try {
            const walletTransaction = await WalletTransactionActions.create(
                new WalletTransactionData(null, req.body.walletId, 
                    +req.body.amount, req.body.type)
            );

            // sequelizeTransaction.commit();
            res.status(201).send(walletTransaction);
        } catch(error) {
            res.sendStatus(500);
            // sequelizeTransaction.rollback();
            console.error(error);
        } 
    }

    static async newTransferTransaction(req, res) {
        console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error(errors);
            return res.status(400).send(errors);
        }

        let sequelizeTransaction = null;

        try {
            let walletTransaction = null;
            sequelizeTransaction = await sequelize.transaction();

            const distributorWallet = await DistributorWalletActions
                .findOne(req.body.walletId, sequelizeTransaction);
                
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
            sequelizeTransaction.commit();
            res.status(201).send(walletTransaction);
        } catch(error) {
            res.sendStatus(500);
            sequelizeTransaction.rollback();
            console.error(error);
        } 
    }

    
    static async newTransaction(req, res) {
        console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error(errors);
            return res.status(400).send(errors);
        }

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
                case 'deposit': {
                    const wallet = await DistributorWallet.findOne({
                        transaction: sequelizeTransaction,
                        where: { distributorUsername: req.body.distributorUsername }
                    });

                    if (!wallet) {
                        sequelizeTransaction.rollback();
                        return res.sendStatus(400);
                    }

                    walletTransaction = await WalletTransactionActions.create(
                        new WalletTransactionData(null, wallet.id, 
                            +req.body.amount, req.body.type, true),
                        sequelizeTransaction
                    );

                    await DistributorWallet.update({
                        balance: Sequelize.literal(`balance + ${walletTransaction.amount}`)
                    }, {
                        transaction: sequelizeTransaction,
                        where: { id: wallet.id }
                    });
                    break;
                }
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
            
            sequelizeTransaction.commit();
            res.status(201).send(walletTransaction);
        } catch(error) {
            res.sendStatus(500);
            sequelizeTransaction.rollback();
            console.error(error);
        } 
    }
}