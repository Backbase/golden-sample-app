import { Link } from "./cms-link";

export interface Media {
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
        ["rendered"]: string;
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
    ["type"]?: 'attachment';
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
     * The id for the author of the object.
     */
    ["author"]?: number;
    /**
     * Whether or not comments are open on the object
     */
    ["comment_status"]?: 'open' | 'closed';
    /**
     * Whether or not the object can be pinged.
     */
    ["ping_status"]?: 'open' | 'closed';
    /**
     * Template
     */
    ["template"]?: string;
    /**
     * Metadata
     */
    ["meta"]?: any[];
    /**
     * The description for the resource.
     */
     ["description"]?: string;
    /**
     * The caption for the resource.
     */
    ["caption"]?: string;
    /**
     * Alternative text to display when resource is not displayed
     */
    ["alt_text"]?: string;
    /**
     * Type of resource.
     */
    ["media_type"]?: 'image' | 'file';
    /**
     * Mime type of resource.
     */
    ["mime_type"]?: string;
    /**
     * Details about the resource file, specific to its type.
     */
    ["media_details"]?: {
        ["width"]?: number;
        ["height"]?: number;
    };
    /**
     * The id for the associated post of the resource.
     */
    ["post"]?: string;
    /**
     * URL to the original resource file.
     */
    ["source_url"]?: string;
    /**
     * Links to different use cases
     */
     ["links"]?: {
        ["self"]?: Link[];
        ["collection"]?: Link[];
        ["about"]?: Link[];
        ["author"]?: Link[];
        ["replies"]?: Link[];
        ["version-history"]?: Link[];
        ["wp:attachment"]?: Link[];
        ["wp:term"]?: Link[];
        ["curies"]?: Link[];
    };
}