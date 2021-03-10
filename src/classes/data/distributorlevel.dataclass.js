
module.exports = class DistributorLevel {

    /**
     * Constructs a new DistributorLevel object.
     * @param {String} id the id of a distributor level
     * @param {String} name the name of a distributor level
     * @param {Number} number the number position of a distributor level
     */
    constructor (id, name, number) {
        this.id = id;
        this.name = name;
        this.number = number;
    }
}