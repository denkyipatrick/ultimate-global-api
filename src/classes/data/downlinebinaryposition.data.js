
module.exports = class DownLineBinaryPositionData {
    /**
     * Constructs a new DistributorDownLine instance
     * @param {String} id 
     * @param {String} distributorUsername
     * @param {String} position 
     */
    constructor(id, distributorUsername, position = "") {
        this.id = id;
        this.position = position;
        this.distributorUsername = distributorUsername;
    }
}