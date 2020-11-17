/* tslint:disable */
/* eslint-disable */
/**
 * Jellyfin API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { SeriesInfo } from './series-info';

/**
 * 
 * @export
 * @interface SeriesInfoRemoteSearchQuery
 */
export interface SeriesInfoRemoteSearchQuery {
    /**
     * 
     * @type {SeriesInfo}
     * @memberof SeriesInfoRemoteSearchQuery
     */
    SearchInfo?: SeriesInfo;
    /**
     * 
     * @type {string}
     * @memberof SeriesInfoRemoteSearchQuery
     */
    ItemId?: string;
    /**
     * Will only search within the given provider when set.
     * @type {string}
     * @memberof SeriesInfoRemoteSearchQuery
     */
    SearchProviderName?: string | null;
    /**
     * Gets or sets a value indicating whether disabled providers should be included.
     * @type {boolean}
     * @memberof SeriesInfoRemoteSearchQuery
     */
    IncludeDisabledProviders?: boolean;
}

