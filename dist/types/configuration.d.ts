import { CountryCode } from '../types';
export interface ImageConfiguration {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: BackdropSizes[];
    logo_sizes: LogoSizes[];
    poster_sizes: PosterSizes[];
    profile_sizes: ProfileSizes[];
    still_sizes: StillSizes[];
}
export interface Configuration {
    images: ImageConfiguration;
    change_keys: ChangeKeys[];
}
export interface CountryConfiguration {
    iso_3166_1: CountryCode;
    english_name: string;
    native_name: string;
}
export interface LanguageConfiguration {
    iso_639_1: string;
    english_name: string;
    name: string;
}
export interface JobConfiguration {
    department: string;
    jobs: string[];
}
export interface TimezoneConfiguration {
    iso_3166_1: CountryCode;
    zones: string[];
}
export declare const MediaSize: {
    readonly W45: "w45";
    readonly W92: "w92";
    readonly W154: "w154";
    readonly W185: "w185";
    readonly W300: "w300";
    readonly W342: "w342";
    readonly W500: "w500";
    readonly W632: "w632";
    readonly W780: "w780";
    readonly W1280: "w1280";
    readonly ORIGINAL: "original";
};
export declare const BackdropSize: {
    readonly W45: "w45";
    readonly W92: "w92";
    readonly W154: "w154";
    readonly W185: "w185";
    readonly W300: "w300";
    readonly W500: "w500";
    readonly W780: "w780";
    readonly W1280: "w1280";
    readonly ORIGINAL: "original";
};
type BackdropSizes = (typeof BackdropSize)[keyof typeof BackdropSize];
export declare const LogoSize: {
    readonly W45: "w45";
    readonly W92: "w92";
    readonly W154: "w154";
    readonly W185: "w185";
    readonly W300: "w300";
    readonly W500: "w500";
    readonly ORIGINAL: "original";
};
type LogoSizes = (typeof LogoSize)[keyof typeof LogoSize];
export declare const PosterSize: {
    readonly W92: "w92";
    readonly W154: "w154";
    readonly W185: "w185";
    readonly W300: "w300";
    readonly W342: "w342";
    readonly W500: "w500";
    readonly W780: "w780";
    readonly ORIGINAL: "original";
};
type PosterSizes = (typeof PosterSize)[keyof typeof PosterSize];
export declare const ProfileSize: {
    readonly W45: "w45";
    readonly W185: "w185";
    readonly W632: "w632";
    readonly ORIGINAL: "original";
};
type ProfileSizes = (typeof ProfileSize)[keyof typeof ProfileSize];
export declare const StillSize: {
    readonly W92: "w92";
    readonly W185: "w185";
    readonly W300: "w300";
    readonly ORIGINAL: "original";
};
type StillSizes = (typeof StillSize)[keyof typeof StillSize];
export declare const ChangeKey: {
    readonly ADULT: "adult";
    readonly AIR_DATE: "air_date";
    readonly ALSO_KNOWN_AS: "also_known_as";
    readonly ALTERNATIVE_TITLES: "alternative_titles";
    readonly BIOGRAPHY: "biography";
    readonly BIRTHDAY: "birthday";
    readonly BUDGET: "budget";
    readonly CAST: "cast";
    readonly CERTIFICATIONS: "certifications";
    readonly CHARACTER_NAMES: "character_names";
    readonly CREATED_BY: "created_by";
    readonly CREW: "crew";
    readonly DEATHDAY: "deathday";
    readonly EPISODE: "episode";
    readonly EPISODE_NUMBER: "episode_number";
    readonly EPISODE_RUN_TIME: "episode_run_time";
    readonly FREEBASE_ID: "freebase_id";
    readonly FREEBASE_MID: "freebase_mid";
    readonly GENERAL: "general";
    readonly GENRES: "genres";
    readonly GUEST_STARS: "guest_stars";
    readonly HOMEPAGE: "homepage";
    readonly IMAGES: "images";
    readonly IMDB_ID: "imdb_id";
    readonly LANGUAGES: "languages";
    readonly NAME: "name";
    readonly NETWORK: "network";
    readonly ORIGIN_COUNTRY: "origin_country";
    readonly ORIGINAL_NAME: "original_name";
    readonly ORIGINAL_TITLE: "original_title";
    readonly OVERVIEW: "overview";
    readonly PARTS: "parts";
    readonly PLACE_OF_BIRTH: "place_of_birth";
    readonly PLOT_KEYWORDS: "plot_keywords";
    readonly PRODUCTION_CODE: "production_code";
    readonly PRODUCTION_COMPANIES: "production_companies";
    readonly PRODUCTION_COUNTRIES: "production_countries";
    readonly RELEASES: "releases";
    readonly REVENUE: "revenue";
    readonly RUNTIME: "runtime";
    readonly SEASON: "season";
    readonly SEASON_NUMBER: "season_number";
    readonly SEASON_REGULAR: "season_regular";
    readonly SPOKEN_LANGUAGES: "spoken_languages";
    readonly STATUS: "status";
    readonly TAGLINE: "tagline";
    readonly TITLE: "title";
    readonly TRANSLATIONS: "translations";
    readonly TVDB_ID: "tvdb_id";
    readonly TVRAGE_ID: "tvrage_id";
    readonly TYPE: "type";
    readonly VIDEO: "video";
    readonly VIDEOS: "videos";
};
type ChangeKeys = (typeof ChangeKey)[keyof typeof ChangeKey];
export {};
