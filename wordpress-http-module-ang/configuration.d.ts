import { HttpParameterCodec } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
export interface CMSConfigurationParameters {
    apiKeys?: {
        [key: string]: string;
    };
    username?: string;
    password?: string;
    accessToken?: string | (() => string);
    basePath?: string;
    withCredentials?: boolean;
    encoder?: HttpParameterCodec;
    /**
     * The keys are the names in the securitySchemes section of the OpenAPI
     * document. They should map to the value used for authentication
     * minus any standard prefixes such as 'Basic' or 'Bearer'.
     */
    credentials?: {
        [key: string]: string | (() => string | undefined);
    };
}
export declare class CMSConfiguration {
    apiKeys?: {
        [key: string]: string;
    };
    username?: string;
    password?: string;
    accessToken?: string | (() => string);
    basePath?: string;
    withCredentials?: boolean;
    encoder?: HttpParameterCodec;
    /**
     * The keys are the names in the securitySchemes section of the OpenAPI
     * document. They should map to the value used for authentication
     * minus any standard prefixes such as 'Basic' or 'Bearer'.
     */
    credentials: {
        [key: string]: string | (() => string | undefined);
    };
    constructor(configurationParameters?: CMSConfigurationParameters);
    /**
     * Select the correct content-type to use for a request.
     * Uses {@link CMSConfiguration#isJsonMime} to determine the correct content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param contentTypes - the array of content types that are available for selection
     * @returns the selected content-type or <code>undefined</code> if no selection could be made.
     */
    selectHeaderContentType(contentTypes: string[]): string | undefined;
    /**
     * Select the correct accept content-type to use for a request.
     * Uses {@link CMSConfiguration#isJsonMime} to determine the correct accept content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param accepts - the array of content types that are available for selection.
     * @returns the selected content-type or <code>undefined</code> if no selection could be made.
     */
    selectHeaderAccept(accepts: string[]): string | undefined;
    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    isJsonMime(mime: string): boolean;
    lookupCredential(key: string): string | undefined;
}
export declare const CONFIG_TOKEN: InjectionToken<unknown>;
