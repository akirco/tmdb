"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvSeasonsEndpoint = void 0;
const base_1 = require("./base");
const BASE_SEASON = (seasonSelection) => {
    return `/tv/${seasonSelection.tvShowID}/season/${seasonSelection.seasonNumber}`;
};
class TvSeasonsEndpoint extends base_1.BaseEndpoint {
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
    }
    async details(seasonSelection, appendToResponse, options) {
        const combinedOptions = {
            append_to_response: appendToResponse
                ? appendToResponse.join(',')
                : undefined,
            ...options,
        };
        return await this.api.get(`${BASE_SEASON(seasonSelection)}`, combinedOptions);
    }
    async aggregateCredits(seasonSelection, options) {
        return await this.api.get(`${BASE_SEASON(seasonSelection)}/aggregate_credits`, options);
    }
    async changes(seasonId, options) {
        return await this.api.get(`/tv/season/${seasonId}/changes`, options);
    }
    async credits(seasonSelection, options) {
        return await this.api.get(`${BASE_SEASON(seasonSelection)}/credits`, options);
    }
    async externalIds(seasonSelection, options) {
        return await this.api.get(`${BASE_SEASON(seasonSelection)}/external_ids`, options);
    }
    async images(seasonSelection, options) {
        const computedOptions = {
            include_image_language: options?.include_image_language?.join(','),
            language: options?.language,
        };
        return await this.api.get(`${BASE_SEASON(seasonSelection)}/images`, computedOptions);
    }
    async videos(seasonSelection, options) {
        const computedOptions = {
            include_video_language: options?.include_video_language?.join(','),
            language: options?.language,
        };
        return await this.api.get(`${BASE_SEASON(seasonSelection)}/videos`, computedOptions);
    }
    async translations(seasonSelection, options) {
        return await this.api.get(`${BASE_SEASON(seasonSelection)}/translations`, options);
    }
}
exports.TvSeasonsEndpoint = TvSeasonsEndpoint;
//# sourceMappingURL=tv-seasons.js.map