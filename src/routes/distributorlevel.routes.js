const DistributorLevelActions = require("../classes/action/distributorlevel.action");

module.exports = app => {
    app.get('/api/distributorlevels', async (req, res) => {
        try {
            const levels = await DistributorLevelActions.findAll();
            res.send(levels);
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }     
    });
}