'use strict';

const {
    DistributorWallet, sequelize
} = require('../sequelize/models/index');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

module.exports = class WalletController {
    static async setWalletPin(req, res) {
        console.log(req.body);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).send(errors);
        }

        try {
            const wallet = await DistributorWallet.update({
                pin: bcryptjs.hashSync(req.body.pin)
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

    static async changeWalletPin(req, res) {
        console.log(req.body);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors);
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