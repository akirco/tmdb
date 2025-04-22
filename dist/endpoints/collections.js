"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionsEndpoint = void 0;
const base_1 = require("./base");
const BASE_COLLECTION = '/collection';
class CollectionsEndpoint extends base_1.BaseEndpoint {
    accessToken;
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
        this.accessToken = accessToken;
    }
    async details(id, options) {
        return await this.api.get(`${BASE_COLLECTION}/${id}`, options);
    }
    async images(id, options) {
        const computedOptions = {
            include_image_language: options?.include_image_language?.join(','),
            language: options?.language,
        };
        return await this.api.get(`${BASE_COLLECTION}/${id}/images`, computedOptions);
    }
    async translations(id, options) {
        return await this.api.get(`${BASE_COLLECTION}/${id}/translations`, options);
    }
}
exports.CollectionsEndpoint = CollectionsEndpoint;
//# sourceMappingURL=collections.js.map