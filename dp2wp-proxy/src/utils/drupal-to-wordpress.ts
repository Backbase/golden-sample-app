import { Post } from '../interfaces/cms-post';
import { Media } from '../interfaces/cms-media';
import { NodeArticle } from '../../../drupal-http-module-ang/model/nodeArticle';
import { NodeImage } from '../../../drupal-http-module-ang/model/nodeImage';

/**
 * The purpose of this service is just to test Drupal and Wordpress
 * in the same way but this will not be needed after having the BE
 * adaptor and/or when we decide which CMS will be the proposed.
 */
export class DrupalToWordpress {
    static nodeToPost(node: NodeArticle): Post {
        const id = node.nid[0].value;
        const title = node.title[0].value;
        const content = node.body ? node.body[0].value : '';

        return {
            id,
            'title': { rendered: title },
            'content': { rendered: content },
        };
    }

    static nodeToMedia(node: NodeImage): Media {
        const id = node.nid[0].value;
        const title = node.title[0].value;

        const media: Media = {
            id,
            'title': { rendered: title },
        };

        if (node.field_image && node.field_image[0]) {
            const imageData = node.field_image[0];
            media.source_url = imageData.url;
            media.media_details = {
                width: imageData.width,
                height: imageData.height
            };
            media.alt_text = imageData.alt;
        }

        return media;
    }
}

