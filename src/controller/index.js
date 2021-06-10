'use strict';

const AdminController = require('./admin.controller');
const WalletController = require('./wallet.controller');
const MessageController = require('./message.controller');
const AdminNewsController = require('./adminnews.controller');
const DistributorController = require('./distributor.controller');
const WalletTransactionController = require('./wallettransaction.controller');

module.exports = {
    AdminController,
    WalletController,
    MessageController,
    AdminNewsController,
    DistributorController,
    WalletTransactionController
}