'use strict';

const { body } = require('express-validator');
const bcryptjs = require('bcryptjs');
const {
    DistributorWallet
} = require('../sequelize/models/index');

const withdrawTransactionValidators = [
    body('walletPin')
    .exists()
    .withMessage("Pin is required")
    .bail()
    .notEmpty()
    .withMessage("Pin is required.")
    .bail()
    .isNumeric()
    .withMessage("Pin should be only digits")
    .bail()
    .isLength({
        max: 4,
        min: 4
    })
    .withMessage("Pin should be 4 digits.")
    .bail(),
    body('amount')
    .exists()
    .withMessage("Amount is required")
    .bail()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount should be a number"),
    body('walletId')
    .exists()
    .withMessage("Wallet could not be found")
    .bail()
    .notEmpty()
    .withMessage("Wallet could not be found")
    .bail()
    .isString()
    .withMessage("Wallet could not be resolved")
    .bail(),
    body('balance')
    .custom(async (_, { req }) => {
        try {
            const wallet = await DistributorWallet.findByPk(req.body.walletId);
            if (wallet.balance < +req.body.amount) {
                return Promise.reject("Wallet has insufficient balance")
            }
        } catch(e) {
            return Promise.reject(e);
        }
    }),
    body('auth_pin')
    .custom(async (_, { req }) => {
        try {
            const wallet = await DistributorWallet.findByPk(req.body.walletId);

            if (!bcryptjs.compareSync(req.body.walletPin, wallet.pin)) {
                return Promise.reject("Wallet Pin is not correct.");
            }
        } catch(e) {
            return Promise.reject(e);
        }
    })
];

module.exports = {
    withdrawTransactionValidators
}