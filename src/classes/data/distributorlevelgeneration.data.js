
module.exports = class DistributorLevelGenerationData {
    
    constructor(distributorUsername, distributorLevel, downLineUsername, downLinePosition = null) {
        this.distributorUsername = distributorUsername;
        this.distributorLevel = distributorLevel;
        this.downLineUsername = downLineUsername;
        this.downLinePosition = downLinePosition;
    }

}