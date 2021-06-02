const { body, param } = require('express-validator');

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
]

module.exports = {
    setPinValidators
}