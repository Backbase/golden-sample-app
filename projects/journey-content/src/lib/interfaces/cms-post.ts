import { Link } from "./cms-link";

export interface Post {
    /**
     * Unique identifier for the object.
     */
    ["id"]?: number;
    /**
     * The date the object was published, in the site\'s timezone.
     */
    ["date"]?: string;
    /**
     * The date the object was published, as GMT.
     */
    ["date_gmt"]?: string;
    /**
     * The globally unique identifier for the object.
     */
    ["guid"]?: {
        rendered: string;
    };
    /**
     * The date the object was last modified, in the site\'s timezone.
     */
    ["modified"]?: string;
    /**
     * The date the object was last modified, as GMT.
     */
    ["modified_gmt"]?: string;
    /**
     * An alphanumeric identifier for the object unique to its type.
     */
    ["slug"]?: string;
    /**
     * A named status for the object.
     */
    ["status"]?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
    /**
     * Type of Post for the object.
     */
    ["type"]?: 'post';
    /**
     * URL to the object.
     */
    ["link"]?: string;
    /**
     * The title for the object.
     */
    ["title"]?: {
        rendered: string;
    };
    /**
     * The content for the object.
     */
    ["content"]?: {
        ["rendered"]: string;
        ["protected"]?: boolean;
    };
    /**
     * The excerpt for the object
     */
    ["excerpt"]?: {
        ["rendered"]: string;
        ["protected"]?: boolean;
    };
    /**
     * The id for the author of the object.
     */
    ["author"]?: number;
    /**
     * The id of the featured media for the object.
     */
    ["featured_media"]?: number;
    /**
     * Whether or not comments are open on the object
     */
    ["comment_status"]?: 'open' | 'closed';
    /**
     * Whether or not the object can be pinged.
     */
    ["ping_status"]?: 'open' | 'closed';
    /**
     * Whether or not the object should be treated as sticky.
     */
    ["sticky"]?: boolean;
    /**
     * Template
     */
    ["template"]?: string;
    /**
     * The format for the object.
     */
    ["format"]?: 'standard' | 'aside' | 'chat' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video' | 'audio';
    /** 
     * Metadata 
     */
    ["meta"]?: Array<any>;
    /**
     * The terms assigned to the object in the category taxonomy.
     */
    ["categories"]?: Array<number>;
    /**
     * The terms assigned to the object in the post_tag taxonomy.
     */
    ["tags"]?: Array<string>;
    /**
     * Links to different use cases
     */
    ["links"]?: {
        ["self"]?: Array<Link>;
        ["collection"]?: Array<Link>;
        ["about"]?: Array<Link>;
        ["author"]?: Array<Link>;
        ["replies"]?: Array<Link>;
        ["version-history"]?: Array<Link>;
        ["wp:attachment"]?: Array<Link>;
        ["wp:term"]?: Array<Link>;
        ["curies"]?: Array<Link>;
    };
}
