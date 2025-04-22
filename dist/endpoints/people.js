"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleEndpoint = void 0;
const base_1 = require("./base");
const BASE_PERSON = '/person';
class PeopleEndpoint extends base_1.BaseEndpoint {
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
    }
    async details(id, appendToResponse, language) {
        const options = {
            append_to_response: appendToResponse
                ? appendToResponse.join(',')
                : undefined,
            language: language,
        };
        return await this.api.get(`${BASE_PERSON}/${id}`, options);
    }
    async changes(id, options) {
        return await this.api.get(`${BASE_PERSON}/${id}/changes`, options);
    }
    async movieCredits(id, options) {
        return await this.api.get(`${BASE_PERSON}/${id}/movie_credits`, options);
    }
    async tvShowCredits(id, options) {
        return await this.api.get(`${BASE_PERSON}/${id}/tv_credits`, options);
    }
    async combinedCredits(id, options) {
        return await this.api.get(`${BASE_PERSON}/${id}/combined_credits`, options);
    }
    async externalId(id) {
        return await this.api.get(`${BASE_PERSON}/${id}/external_ids`);
    }
    async images(id) {
        return await this.api.get(`${BASE_PERSON}/${id}/images`);
    }
    /**
     * @deprecated
     */
    async taggedImages(id, options) {
        return await this.api.get(`${BASE_PERSON}/${id}/tagged_images`, options);
    }
    async translation(id) {
        return await this.api.get(`${BASE_PERSON}/${id}/translations`);
    }
    async latest() {
        return await this.api.get(`${BASE_PERSON}/latest`);
    }
    async popular(options) {
        return await this.api.get(`${BASE_PERSON}/popular`, options);
    }
}
exports.PeopleEndpoint = PeopleEndpoint;
//# sourceMappingURL=people.js.map