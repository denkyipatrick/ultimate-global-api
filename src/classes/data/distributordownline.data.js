
module.exports = class DistributorDownLineData {

    /**
     * Constructs a new DistributorDownLine instance
     * @param {String} id 
     * @param {String} distributorUsername 
     * @param {String} downLineUsername 
     * @param {String} position 
     */
    constructor(id, distributorUsername, downLineUsername, position = "") {
        this.id = id;
        this.position = position;
        this.downLineUsername = downLineUsername;
        this.distributorUsername = distributorUsername;
    }
}