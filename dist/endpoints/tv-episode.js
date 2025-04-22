"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvEpisodesEndpoint = void 0;
const base_1 = require("./base");
const BASE_EPISODE = (episodeSelection) => {
    return `/tv/${episodeSelection.tvShowID}/season/${episodeSelection.seasonNumber}/episode/${episodeSelection.episodeNumber}`;
};
class TvEpisodesEndpoint extends base_1.BaseEndpoint {
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
    }
    async details(episodeSelection, appendToResponse, options) {
        const combinedOptions = {
            append_to_response: appendToResponse
                ? appendToResponse.join(',')
                : undefined,
            ...options,
        };
        return await this.api.get(`${BASE_EPISODE(episodeSelection)}`, combinedOptions);
    }
    async changes(episodeID, options) {
        return await this.api.get(`/tv/episode/${episodeID}/changes`, options);
    }
    async credits(episodeSelection, options) {
        return await this.api.get(`${BASE_EPISODE(episodeSelection)}/credits`, options);
    }
    async externalIds(episodeSelection) {
        return await this.api.get(`${BASE_EPISODE(episodeSelection)}/external_ids`);
    }
    async images(episodeSelection, options) {
        const computedOptions = {
            include_image_language: options?.include_image_language?.join(','),
            language: options?.language,
        };
        return await this.api.get(`${BASE_EPISODE(episodeSelection)}/images`, computedOptions);
    }
    async translations(episodeSelection) {
        return await this.api.get(`${BASE_EPISODE(episodeSelection)}/translations`);
    }
    async videos(episodeSelection, options) {
        const computedOptions = {
            include_video_language: options?.include_video_language?.join(','),
            language: options?.language,
        };
        return await this.api.get(`${BASE_EPISODE(episodeSelection)}/videos`, computedOptions);
    }
}
exports.TvEpisodesEndpoint = TvEpisodesEndpoint;
//# sourceMappingURL=tv-episode.js.map