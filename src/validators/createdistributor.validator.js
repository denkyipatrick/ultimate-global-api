'use strict';

const { body } = require('express-validator');
const {
    Distributor,
    DistributorWallet,
    DistributorLevelGeneration
} = require('../sequelize/models/index');

const validators = [
    body('username')
    .notEmpty()
    .withMessage('Username cannot be empty.')
    .bail()
    .isLength({min: 5, max: 25})
    .withMessage('Username is out of range. ' + 
    'it should be between 5 and 25 characters')
    .isAlphanumeric()
    .withMessage('Username should be alphanumeric')
    .bail()
    .custom(async (username, { req }) => {
        if (await Distributor.findByPk(username)) {
            return Promise.reject('Username is used. ' + 
            'Choose a different username');
        }
    }),
    body('sponsorUsername')
    .notEmpty()
    .withMessage('Sponsor username cannot be empty.')
    .isAlphanumeric()
    .withMessage('Sponsor username should be alphanumeric.')
    .bail()
    .custom(username => {
        return Distributor.findByPk(username)
        .then(dist => {
            if (!dist) {
                return Promise.reject('Sponsor does not exists');
            }
        });
    })
    .bail(),
    // .custom(async username => {
    //     const sponsorWallet = await DistributorWallet.findOne({
    //         where: {
    //             distributorUsername: username
    //         }
    //     });

    //     if (sponsorWallet.balance < 5) { // } 10 < 0) {
    //         return Promise.reject("Sponsor has insufficient balance.");
    //     }
    // })
    body('registrarSponsorUsername')
    .exists()
    .withMessage("Registrar username is invalid")
    .bail()
    .notEmpty()
    .withMessage("Registrar username is invalid")
    .bail()
    .custom(async username => {
        const sponsorWallet = await DistributorWallet.findOne({
            where: {
                distributorUsername: username
            }
        });

        if (sponsorWallet.balance - 10 < 0) {
            return Promise.reject("You have insufficient balance.");
        }
    })
    .bail(),
    body('upLineUsername')
    .notEmpty()
    .withMessage('upLine username cannot be empty.')
    .isAlphanumeric()
    .withMessage('upLine username should be alphanumeric.')
    .custom(async username => {
        if (! await Distributor.findByPk(username)) {
            return Promise.reject('UpLine does not exists');
        }
    })
    .bail()
    .custom(async username => {
        const upLineStarterGeneration = await DistributorLevelGeneration.findOne({
            where: {
                username: username,
                levelId: 'starter_stage_1'
            },
            include: ['downLines']
        });

        if (upLineStarterGeneration.downLines.length === 2) {
            return Promise.reject('UpLine\'s immediate down lines are occupied. Change upline.')
        }
    }),
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email address is invalid.')
]

module.exports = validators;