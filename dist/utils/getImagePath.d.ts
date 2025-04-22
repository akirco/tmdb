/**
 * Utility method to construct full url for image
 * based on configuration
 *
 * https://developers.themoviedb.org/3/getting-started/images
 * @param {string} baseUrl base image url
 * @param {string} fileSize file size
 * @param {string} imagePath raw image path
 * @param {boolean} svg get svg version if true
 */
export declare const getFullImagePath: (baseUrl: string, fileSize: string, imagePath: string, svg?: boolean) => string;
