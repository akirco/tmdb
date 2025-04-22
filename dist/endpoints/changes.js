"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeEndpoint = void 0;
const base_1 = require("./base");
class ChangeEndpoint extends base_1.BaseEndpoint {
    accessToken;
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
        this.accessToken = accessToken;
    }
    async movies(options) {
        return await this.api.get(`/movie/changes`, options);
    }
    async tvShows(options) {
        return await this.api.get(`/tv/changes`, options);
    }
    async person(options) {
        return await this.api.get(`/person/changes`, options);
    }
}
exports.ChangeEndpoint = ChangeEndpoint;
//# sourceMappingURL=changes.js.map