"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesEndpoint = void 0;
const base_1 = require("./base");
const BASE_MOVIE = '/movie';
class MoviesEndpoint extends base_1.BaseEndpoint {
    accessToken;
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
        this.accessToken = accessToken;
    }
    async details(id, appendToResponse, language) {
        const options = {
            append_to_response: appendToResponse
                ? appendToResponse.join(',')
                : undefined,
            language: language,
        };
        return await this.api.get(`${BASE_MOVIE}/${id}`, options);
    }
    async alternativeTitles(id) {
        return await this.api.get(`${BASE_MOVIE}/${id}/alternative_titles`);
    }
    async changes(id, options) {
        return await this.api.get(`${BASE_MOVIE}/${id}/changes`, options);
    }
    async credits(id, options) {
        return await this.api.get(`${BASE_MOVIE}/${id}/credits`, options);
    }
    async externalIds(id) {
        return await this.api.get(`${BASE_MOVIE}/${id}/external_ids`);
    }
    async images(id, options) {
        const computedOptions = {
            include_image_language: options?.include_image_language?.join(','),
            language: options?.language,
        };
        return await this.api.get(`${BASE_MOVIE}/${id}/images`, computedOptions);
    }
    async keywords(id) {
        return await this.api.get(`${BASE_MOVIE}/${id}/keywords`);
    }
    async lists(id, options) {
        return await this.api.get(`${BASE_MOVIE}/${id}/lists`, options);
    }
    async recommendations(id, options) {
        return await this.api.get(`${BASE_MOVIE}/${id}/recommendations`, options);
    }
    async releaseDates(id) {
        return await this.api.get(`${BASE_MOVIE}/${id}/release_dates`);
    }
    async reviews(id, options) {
        return await this.api.get(`${BASE_MOVIE}/${id}/reviews`, options);
    }
    async similar(id, options) {
        return await this.api.get(`${BASE_MOVIE}/${id}/similar`, options);
    }
    async translations(id) {
        return await this.api.get(`${BASE_MOVIE}/${id}/translations`);
    }
    async videos(id, options) {
        return await this.api.get(`${BASE_MOVIE}/${id}/videos`, options);
    }
    /**
     * Powered by JustWatch
     * @param id
     */
    async watchProviders(id) {
        return await this.api.get(`${BASE_MOVIE}/${id}/watch/providers`);
    }
    async latest() {
        return await this.api.get(`${BASE_MOVIE}/latest`);
    }
    async nowPlaying(options) {
        return await this.api.get(`${BASE_MOVIE}/now_playing`, options);
    }
    async popular(options) {
        return await this.api.get(`${BASE_MOVIE}/popular`, options);
    }
    async topRated(options) {
        return await this.api.get(`${BASE_MOVIE}/top_rated`, options);
    }
    async upcoming(options) {
        return await this.api.get(`${BASE_MOVIE}/upcoming`, options);
    }
}
exports.MoviesEndpoint = MoviesEndpoint;
//# sourceMappingURL=movies.js.map