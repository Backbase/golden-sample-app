import * as i0 from '@angular/core';
import { InjectionToken, NgModule, Optional, SkipSelf, Injectable, Inject } from '@angular/core';
import * as i1 from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DataModulesManager, createMocks } from '@backbase/foundation-ang/data-http';

/**
 * Wordpress v2 API
 * Wordpress v2 API
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://github.com/Backbase/backbase-openapi-tools).
 * https://github.com/Backbase/backbase-openapi-tools
 * Do not edit the class manually.
 */
var CommonPostPage;
(function (CommonPostPage) {
    CommonPostPage.StatusEnum = {
        Publish: 'publish',
        Future: 'future',
        Draft: 'draft',
        Pending: 'pending',
        Private: 'private'
    };
    CommonPostPage.CommentStatusEnum = {
        Open: 'open',
        Closed: 'closed'
    };
    CommonPostPage.PingStatusEnum = {
        Open: 'open',
        Closed: 'closed'
    };
})(CommonPostPage || (CommonPostPage = {}));

/**
 * Wordpress v2 API
 * Wordpress v2 API
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://github.com/Backbase/backbase-openapi-tools).
 * https://github.com/Backbase/backbase-openapi-tools
 * Do not edit the class manually.
 */
var Media;
(function (Media) {
    Media.StatusEnum = {
        Publish: 'publish',
        Future: 'future',
        Draft: 'draft',
        Pending: 'pending',
        Private: 'private'
    };
    Media.CommentStatusEnum = {
        Open: 'open',
        Closed: 'closed'
    };
    Media.PingStatusEnum = {
        Open: 'open',
        Closed: 'closed'
    };
    Media.MediaTypeEnum = {
        Image: 'image',
        File: 'file'
    };
})(Media || (Media = {}));

/**
 * Wordpress v2 API
 * Wordpress v2 API
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://github.com/Backbase/backbase-openapi-tools).
 * https://github.com/Backbase/backbase-openapi-tools
 * Do not edit the class manually.
 */
var Page;
(function (Page) {
    Page.StatusEnum = {
        Publish: 'publish',
        Future: 'future',
        Draft: 'draft',
        Pending: 'pending',
        Private: 'private'
    };
    Page.CommentStatusEnum = {
        Open: 'open',
        Closed: 'closed'
    };
    Page.PingStatusEnum = {
        Open: 'open',
        Closed: 'closed'
    };
})(Page || (Page = {}));

/**
 * Wordpress v2 API
 * Wordpress v2 API
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://github.com/Backbase/backbase-openapi-tools).
 * https://github.com/Backbase/backbase-openapi-tools
 * Do not edit the class manually.
 */

/**
 * Wordpress v2 API
 * Wordpress v2 API
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://github.com/Backbase/backbase-openapi-tools).
 * https://github.com/Backbase/backbase-openapi-tools
 * Do not edit the class manually.
 */
var Post;
(function (Post) {
    Post.StatusEnum = {
        Publish: 'publish',
        Future: 'future',
        Draft: 'draft',
        Pending: 'pending',
        Private: 'private'
    };
    Post.CommentStatusEnum = {
        Open: 'open',
        Closed: 'closed'
    };
    Post.PingStatusEnum = {
        Open: 'open',
        Closed: 'closed'
    };
    Post.FormatEnum = {
        Standard: 'standard',
        Aside: 'aside',
        Chat: 'chat',
        Gallery: 'gallery',
        Link: 'link',
        Image: 'image',
        Quote: 'quote',
        Status: 'status',
        Video: 'video',
        Audio: 'audio'
    };
})(Post || (Post = {}));

/**
 * Wordpress v2 API
 * Wordpress v2 API
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://github.com/Backbase/backbase-openapi-tools).
 * https://github.com/Backbase/backbase-openapi-tools
 * Do not edit the class manually.
 */
var PostAllOf;
(function (PostAllOf) {
    PostAllOf.StatusEnum = {
        Publish: 'publish',
        Future: 'future',
        Draft: 'draft',
        Pending: 'pending',
        Private: 'private'
    };
    PostAllOf.CommentStatusEnum = {
        Open: 'open',
        Closed: 'closed'
    };
    PostAllOf.PingStatusEnum = {
        Open: 'open',
        Closed: 'closed'
    };
})(PostAllOf || (PostAllOf = {}));

/**
 * Wordpress v2 API
 * Wordpress v2 API
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://github.com/Backbase/backbase-openapi-tools).
 * https://github.com/Backbase/backbase-openapi-tools
 * Do not edit the class manually.
 */
var PostAllOf1;
(function (PostAllOf1) {
    PostAllOf1.FormatEnum = {
        Standard: 'standard',
        Aside: 'aside',
        Chat: 'chat',
        Gallery: 'gallery',
        Link: 'link',
        Image: 'image',
        Quote: 'quote',
        Status: 'status',
        Video: 'video',
        Audio: 'audio'
    };
})(PostAllOf1 || (PostAllOf1 = {}));

const CMS_BASE_PATH = new InjectionToken('CMS_BASE_PATH');
const COLLECTION_FORMATS = {
    'csv': ',',
    'tsv': '   ',
    'ssv': ' ',
    'pipes': '|'
};

class CMSConfiguration {
    constructor(configurationParameters = {}) {
        this.apiKeys = configurationParameters.apiKeys;
        this.username = configurationParameters.username;
        this.password = configurationParameters.password;
        this.accessToken = configurationParameters.accessToken;
        this.basePath = configurationParameters.basePath;
        this.withCredentials = configurationParameters.withCredentials;
        this.encoder = configurationParameters.encoder;
        if (configurationParameters.credentials) {
            this.credentials = configurationParameters.credentials;
        }
        else {
            this.credentials = {};
        }
        // init default oauth credential
        if (!this.credentials['oauth']) {
            this.credentials['oauth'] = () => {
                return typeof this.accessToken === 'function'
                    ? this.accessToken()
                    : this.accessToken;
            };
        }
    }
    /**
     * Select the correct content-type to use for a request.
     * Uses {@link CMSConfiguration#isJsonMime} to determine the correct content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param contentTypes - the array of content types that are available for selection
     * @returns the selected content-type or <code>undefined</code> if no selection could be made.
     */
    selectHeaderContentType(contentTypes) {
        if (contentTypes.length === 0) {
            return undefined;
        }
        const type = contentTypes.find((x) => this.isJsonMime(x));
        if (type === undefined) {
            return contentTypes[0];
        }
        return type;
    }
    /**
     * Select the correct accept content-type to use for a request.
     * Uses {@link CMSConfiguration#isJsonMime} to determine the correct accept content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param accepts - the array of content types that are available for selection.
     * @returns the selected content-type or <code>undefined</code> if no selection could be made.
     */
    selectHeaderAccept(accepts) {
        if (accepts.length === 0) {
            return undefined;
        }
        const type = accepts.find((x) => this.isJsonMime(x));
        if (type === undefined) {
            return accepts[0];
        }
        return type;
    }
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
    isJsonMime(mime) {
        const jsonMime = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return mime !== null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
    }
    lookupCredential(key) {
        const value = this.credentials[key];
        return typeof value === 'function'
            ? value()
            : value;
    }
}
const CONFIG_TOKEN = new InjectionToken('api-data-module CMSConfiguration');

class CMSApiModule {
    constructor(parentModule, http, dataModulesManager, config) {
        if (parentModule) {
            throw new Error('CMSApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
                'See also https://github.com/angular/angular/issues/20575');
        }
        if (dataModulesManager) {
            dataModulesManager.setModuleConfig(CONFIG_TOKEN, {
                apiRoot: '',
                servicePath: config.basePath || '',
                headers: {},
            });
        }
    }
    static forRoot(configurationFactory) {
        return {
            ngModule: CMSApiModule,
            providers: [{ provide: CMSConfiguration, useFactory: configurationFactory }]
        };
    }
}
CMSApiModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                declarations: [],
                exports: [],
                providers: []
            },] }
];
CMSApiModule.ctorParameters = () => [
    { type: CMSApiModule, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: HttpClient, decorators: [{ type: Optional }] },
    { type: DataModulesManager, decorators: [{ type: Optional }] },
    { type: CMSConfiguration }
];

/**
 * Custom HttpParameterCodec
 * Workaround for https://github.com/angular/angular/issues/18261
 */
class CustomHttpParameterCodec {
    encodeKey(k) {
        return encodeURIComponent(k);
    }
    encodeValue(v) {
        return encodeURIComponent(v);
    }
    decodeKey(k) {
        return decodeURIComponent(k);
    }
    decodeValue(v) {
        return decodeURIComponent(v);
    }
}

/**
 * Wordpress v2 API
 * Wordpress v2 API
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://github.com/Backbase/backbase-openapi-tools).
 * https://github.com/Backbase/backbase-openapi-tools
 * Do not edit the class manually.
 */
class DefaultHttpService {
    constructor(httpClient, basePath, configuration) {
        this.httpClient = httpClient;
        this.basePath = '/wp-json/wp/v2';
        this.defaultHeaders = new HttpHeaders();
        this.configuration = new CMSConfiguration();
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }
    addToHttpParams(httpParams, value, key) {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        }
        else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }
    addToHttpParamsRecursive(httpParams, value, key) {
        if (value == null) {
            return httpParams;
        }
        if (typeof value === "object") {
            if (Array.isArray(value)) {
                value.forEach(elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            }
            else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key, value.toISOString().substr(0, 10));
                }
                else {
                    throw Error("key may not be null if value is Date");
                }
            }
            else {
                Object.keys(value).forEach(k => httpParams = this.addToHttpParamsRecursive(httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        }
        else if (key != null) {
            httpParams = httpParams.append(key, value);
        }
        else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }
    mediaIdGet(requestParameters, observe = 'body', reportProgress = false, options) {
        const _id = requestParameters["id"];
        if (_id === null || _id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling mediaIdGet.');
        }
        const _context = requestParameters["context"];
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (_context !== undefined && _context !== null) {
            queryParameters = this.addToHttpParams(queryParameters, _context, 'context');
        }
        let headers = this.defaultHeaders;
        let httpHeaderAcceptSelected = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        let responseType = 'json';
        if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }
        return this.httpClient.get(`${this.configuration.basePath}/media/${encodeURIComponent(String(_id))}`, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    mediaIdGetUrl(requestParameters) {
        const _id = requestParameters["id"];
        if (_id === null || _id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling mediaIdGet.');
        }
        const _context = requestParameters["context"];
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (_context !== undefined && _context !== null) {
            queryParameters = this.addToHttpParams(queryParameters, _context, 'context');
        }
        const queryString = queryParameters.toString();
        return `${this.configuration.basePath}/media/${encodeURIComponent(String(_id))}${queryString ? `?${queryString}` : ''}`;
    }
    pagesIdGet(requestParameters, observe = 'body', reportProgress = false, options) {
        const _id = requestParameters["id"];
        if (_id === null || _id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling pagesIdGet.');
        }
        const _context = requestParameters["context"];
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (_context !== undefined && _context !== null) {
            queryParameters = this.addToHttpParams(queryParameters, _context, 'context');
        }
        let headers = this.defaultHeaders;
        let httpHeaderAcceptSelected = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        let responseType = 'json';
        if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }
        return this.httpClient.get(`${this.configuration.basePath}/pages/${encodeURIComponent(String(_id))}`, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    pagesIdGetUrl(requestParameters) {
        const _id = requestParameters["id"];
        if (_id === null || _id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling pagesIdGet.');
        }
        const _context = requestParameters["context"];
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (_context !== undefined && _context !== null) {
            queryParameters = this.addToHttpParams(queryParameters, _context, 'context');
        }
        const queryString = queryParameters.toString();
        return `${this.configuration.basePath}/pages/${encodeURIComponent(String(_id))}${queryString ? `?${queryString}` : ''}`;
    }
    postsIdGet(requestParameters, observe = 'body', reportProgress = false, options) {
        const _id = requestParameters["id"];
        if (_id === null || _id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling postsIdGet.');
        }
        const _context = requestParameters["context"];
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (_context !== undefined && _context !== null) {
            queryParameters = this.addToHttpParams(queryParameters, _context, 'context');
        }
        let headers = this.defaultHeaders;
        let httpHeaderAcceptSelected = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        let responseType = 'json';
        if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }
        return this.httpClient.get(`${this.configuration.basePath}/posts/${encodeURIComponent(String(_id))}`, {
            params: queryParameters,
            responseType: responseType,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    postsIdGetUrl(requestParameters) {
        const _id = requestParameters["id"];
        if (_id === null || _id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling postsIdGet.');
        }
        const _context = requestParameters["context"];
        let queryParameters = new HttpParams({ encoder: this.encoder });
        if (_context !== undefined && _context !== null) {
            queryParameters = this.addToHttpParams(queryParameters, _context, 'context');
        }
        const queryString = queryParameters.toString();
        return `${this.configuration.basePath}/posts/${encodeURIComponent(String(_id))}${queryString ? `?${queryString}` : ''}`;
    }
}
DefaultHttpService.ɵprov = i0.ɵɵdefineInjectable({ factory: function DefaultHttpService_Factory() { return new DefaultHttpService(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(CMS_BASE_PATH, 8), i0.ɵɵinject(CMSConfiguration, 8)); }, token: DefaultHttpService, providedIn: "root" });
DefaultHttpService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
DefaultHttpService.ctorParameters = () => [
    { type: HttpClient },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [CMS_BASE_PATH,] }] },
    { type: CMSConfiguration, decorators: [{ type: Optional }] }
];

/**
* Mocks provider for /wp-json/wp/v2/media/{id} URL pattern
*/
const DefaultHttpServiceMediaIdGetMocksProvider = createMocks([{
        urlPattern: "/wp-json/wp/v2/media/{id}",
        method: "GET",
        responses: []
    }]);
/**
* Mocks provider for /wp-json/wp/v2/pages/{id} URL pattern
*/
const DefaultHttpServicePagesIdGetMocksProvider = createMocks([{
        urlPattern: "/wp-json/wp/v2/pages/{id}",
        method: "GET",
        responses: []
    }]);
/**
* Mocks provider for /wp-json/wp/v2/posts/{id} URL pattern
*/
const DefaultHttpServicePostsIdGetMocksProvider = createMocks([{
        urlPattern: "/wp-json/wp/v2/posts/{id}",
        method: "GET",
        responses: []
    }]);
const DefaultHttpServiceMocksProvider = createMocks([
    {
        urlPattern: "/wp-json/wp/v2/media/{id}",
        method: "GET",
        responses: []
    },
    {
        urlPattern: "/wp-json/wp/v2/pages/{id}",
        method: "GET",
        responses: []
    },
    {
        urlPattern: "/wp-json/wp/v2/posts/{id}",
        method: "GET",
        responses: []
    },
]);

/**
 * Generated bundle index. Do not edit.
 */

export { CMSApiModule, CMSConfiguration, CMS_BASE_PATH, COLLECTION_FORMATS, CONFIG_TOKEN, CommonPostPage, DefaultHttpService, DefaultHttpServiceMediaIdGetMocksProvider, DefaultHttpServiceMocksProvider, DefaultHttpServicePagesIdGetMocksProvider, DefaultHttpServicePostsIdGetMocksProvider, Media, Page, Post, PostAllOf, PostAllOf1 };
//# sourceMappingURL=backbase-wordpress-http-module-ang.js.map
