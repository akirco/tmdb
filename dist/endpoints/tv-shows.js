"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvShowsEndpoint = void 0;
const base_1 = require("./base");
const BASE_TV = '/tv';
class TvShowsEndpoint extends base_1.BaseEndpoint {
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
        return await this.api.get(`${BASE_TV}/${id}`, options);
    }
    async alternativeTitles(id) {
        return await this.api.get(`${BASE_TV}/${id}/alternative_titles`);
    }
    async changes(id, options) {
        return await this.api.get(`${BASE_TV}/${id}/changes`, options);
    }
    async contentRatings(id) {
        return await this.api.get(`${BASE_TV}/${id}/content_ratings`);
    }
    async aggregateCredits(id, options) {
        return await this.api.get(`${BASE_TV}/${id}/aggregate_credits`, options);
    }
    async credits(id, options) {
        return await this.api.get(`${BASE_TV}/${id}/credits`, options);
    }
    async season(tvId, seasonNumber) {
        return await this.api.get(`${BASE_TV}/${tvId}/season/${seasonNumber}`);
    }
    async episodeGroups(id) {
        return await this.api.get(`${BASE_TV}/${id}/episode_groups`);
    }
    async externalIds(id) {
        return await this.api.get(`${BASE_TV}/${id}/external_ids`);
    }
    async images(id, options) {
        const computedOptions = {
            include_image_language: options?.include_image_language?.join(','),
            language: options?.language,
        };
        return await this.api.get(`${BASE_TV}/${id}/images`, computedOptions);
    }
    async keywords(id) {
        return await this.api.get(`${BASE_TV}/${id}/keywords`);
    }
    async recommendations(id, options) {
        return await this.api.get(`${BASE_TV}/${id}/recommendations`, options);
    }
    async reviews(id, options) {
        return await this.api.get(`${BASE_TV}/${id}/reviews`, options);
    }
    async screenedTheatrically(id) {
        return await this.api.get(`${BASE_TV}/${id}/screened_theatrically`);
    }
    async similar(id, options) {
        return await this.api.get(`${BASE_TV}/${id}/similar`, options);
    }
    async translations(id) {
        return await this.api.get(`${BASE_TV}/${id}/translations`);
    }
    async videos(id, options) {
        const computedOptions = {
            include_video_language: options?.include_video_language?.join(','),
            language: options?.language,
        };
        return await this.api.get(`${BASE_TV}/${id}/videos`, computedOptions);
    }
    /**
     * Powered by JustWatch
     * @param id
     */
    async watchProviders(id) {
        return await this.api.get(`${BASE_TV}/${id}/watch/providers`);
    }
    async latest() {
        return await this.api.get(`${BASE_TV}/latest`);
    }
    async onTheAir(options) {
        return await this.api.get(`${BASE_TV}/on_the_air`, options);
    }
    async airingToday(options) {
        return await this.api.get(`${BASE_TV}/airing_today`, options);
    }
    async popular(options) {
        return await this.api.get(`${BASE_TV}/popular`, options);
    }
    async topRated(options) {
        return await this.api.get(`${BASE_TV}/top_rated`, options);
    }
}
exports.TvShowsEndpoint = TvShowsEndpoint;
//# sourceMappingURL=tv-shows.js.map