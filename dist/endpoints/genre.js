"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreEndpoint = void 0;
const base_1 = require("./base");
class GenreEndpoint extends base_1.BaseEndpoint {
    accessToken;
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
        this.accessToken = accessToken;
    }
    async movies(options) {
        return await this.api.get('/genre/movie/list', options);
    }
    async tvShows(options) {
        return await this.api.get('/genre/tv/list', options);
    }
}
exports.GenreEndpoint = GenreEndpoint;
//# sourceMappingURL=genre.js.map