
module.exports = class DistributorData {

    /**
     * Constructs a new distributor object.
     * @param {String} username a distributor's username
     * @param {String} sponsorUsername the username of the distributor sponsoring this distributor
     * @param {String} upLineUsername the username of the distributor's upline
     * @param {DistributorLevel} distributorLevel a distributor's ranking level
     */
    constructor(username, password, 
        lastName, firstName, phoneNumber, 
        sponsorUsername, upLineUsername,
        emailAddress, dateOfBirth,
        city, country,
        distributorLevel = null) {
        this.city = city;
        this.country = country;
        this.username = username;
        this.lastName = lastName;
        this.password = password;
        this.firstName = firstName;
        this.dateOfBirth = dateOfBirth;
        this.phoneNumber = phoneNumber;
        this.emailAddress = emailAddress;
        this.upLineUsername = upLineUsername;
        this.sponsorUsername = sponsorUsername;
        this.distributorLevel = distributorLevel;
    }
}