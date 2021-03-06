'use strict';

const {
    DistributorWallet, sequelize
} = require('../sequelize/models/index');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

module.exports = class WalletController {
    static async authWalletPin(req, res) {
        const wallet = await DistributorWallet.findByPk(req.params.walletId);

        // if (!bcryptjs.compareSync(req.body.pin, wallet.pin)) {
        //     return res.sendStatus(400);
        // }

        res.send()
    }

    static async setWalletPin(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).send(errors);
        }

        try {
            const wallet = await DistributorWallet.update({
                pin: bcryptjs.hashSync(req.body.pin)
            }, {
                where: { id: req.params.walletId || req.body.walletId }
            })
            .then(() => 
                DistributorWallet.findByPk(req.params.walletId || req.body.walletId)
            );

            res.send(wallet);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }

    static async changeWalletPin(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send(errors);
        }

        try {
            const wallet = await DistributorWallet.update({
                pin: bcryptjs.hashSync(req.body.newPin)
            }, {
                where: { id: req.params.walletId }
            })
            .then(() => 
                DistributorWallet.findByPk(req.params.walletId)
            );

            res.send(wallet);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    }
}