export default class jwtConf {
    secretKey;
    expiration;
    refreshExpiration;

    static setSecretKey(secretKey) {
        this.secretKey = secretKey;
        return this.secretKey;
    }

    static setExpiration(expiration) {
        this.expiration = expiration;
        return this.expiration;
    }

    static setRefreshExpiration(refreshExpiration) {
        this.refreshExpiration = refreshExpiration;
        return this.refreshExpiration;
    }
}