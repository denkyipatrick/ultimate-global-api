const { body, param, check } = require('express-validator');
const bcryptjs = require('bcryptjs');
const {
    DistributorWallet
} = require('../sequelize/models/index');

const setPinValidators = [
    body('pin')
    .exists()
    .withMessage("You must enter a pin.")
    .bail()
    .notEmpty()
    .withMessage("Pin cannot be empty.")
    .bail()
    .isNumeric({ no_symbols: true })
    .withMessage("Pin can only be numbers")
    .isLength({
        min: 4,
        max: 4
    })
    .withMessage("Pin should be 4 digits")
    .bail(),
    param('walletId')
    .exists()
    .withMessage("WalletId should exist.")
    .bail()
    .custom(async walletId => {
        try {
            const wallet = await DistributorWallet.findByPk(walletId);

            if (!wallet) {
                return Promise.reject("wallet_not_found");
            }
        } catch(error) {
            return Promise.reject(error);
        }
    })
];

const changePinValidators = [
    body('currentPin')
    .exists()
    .withMessage("Current pin must be provided")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Current pin must be provided")
    .bail()
    .isNumeric()
    .withMessage("Current Pin must be 4 digits")
    .bail()
    .isLength({
        min: 4,
        max: 4
    })
    .withMessage("Current Pin must be 4 digits")
    .bail(),
    body('newPin')
    .exists()
    .withMessage("New pin must be provided")
    .bail()
    .notEmpty()
    .withMessage("New pin must be provided")
    .bail()
    .isNumeric()
    .withMessage("New pin must be 4 digits")
    .bail()
    .isLength({
        min: 4,
        max: 4
    })
    .withMessage("New Pin must be 4 digits")
    .bail(),
    param('walletId')
    .exists()
    .withMessage("Wallet could not be found")
    .notEmpty()
    .withMessage("Wallet could not be found")
    .bail()
    .custom(async (walletId, { req }) => {
        try {
            const wallet = await DistributorWallet.findByPk(walletId);

            if (!wallet) {
                return Promise.reject("Wallet not available");
            }

            if (!bcryptjs.compareSync(req.body.currentPin, wallet.pin)) {
                return Promise.reject("You current pin is incorrect");
            }
        } catch(error) {
            return Promise.reject(error);
        }
    })
    // body('equal_pin')
    // .custom((_, { req }) => {
    //     if (req.body.newPin !== req.body.currentPin) {
    //         return Promise.reject("Current and new pins cannot be the same.");
    //     }
    // })
];

module.exports = {
    setPinValidators,
    changePinValidators
}