"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationEndpoint = void 0;
const base_1 = require("./base");
class ConfigurationEndpoint extends base_1.BaseEndpoint {
    accessToken;
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
        this.accessToken = accessToken;
    }
    async getApiConfiguration() {
        return await this.api.get(`/configuration`);
    }
    async getCountries() {
        return await this.api.get(`/configuration/countries`);
    }
    async getLanguages() {
        return await this.api.get(`/configuration/languages`);
    }
    async getJobs() {
        return await this.api.get(`/configuration/jobs`);
    }
    async getPrimaryTranslations() {
        return await this.api.get(`/configuration/primary_translations`);
    }
    async getTimezones() {
        return await this.api.get(`/configuration/timezones`);
    }
}
exports.ConfigurationEndpoint = ConfigurationEndpoint;
//# sourceMappingURL=configuration.js.map