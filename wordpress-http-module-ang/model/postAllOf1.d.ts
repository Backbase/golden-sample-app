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
export interface PostAllOf1 {
    /**
     * The format for the object.
     */
    ["format"]?: PostAllOf1.FormatEnum;
    /**
     * Whether or not the object should be treated as sticky.
     */
    ["sticky"]?: boolean;
    /**
     * The terms assigned to the object in the category taxonomy.
     */
    ["categories"]?: Array<string>;
    /**
     * he terms assigned to the object in the post_tag taxonomy.
     */
    ["tags"]?: Array<string>;
}
export declare namespace PostAllOf1 {
    type FormatEnum = 'standard' | 'aside' | 'chat' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video' | 'audio';
    const FormatEnum: {
        Standard: FormatEnum;
        Aside: FormatEnum;
        Chat: FormatEnum;
        Gallery: FormatEnum;
        Link: FormatEnum;
        Image: FormatEnum;
        Quote: FormatEnum;
        Status: FormatEnum;
        Video: FormatEnum;
        Audio: FormatEnum;
    };
}
