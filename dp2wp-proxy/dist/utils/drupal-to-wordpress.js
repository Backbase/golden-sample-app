"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrupalToWordpress = void 0;
/**
 * The purpose of this service is just to test Drupal and Wordpress
 * in the same way but this will not be needed after having the BE
 * adaptor and/or when we decide which CMS will be the proposed.
 */
class DrupalToWordpress {
    static nodeToPost(node) {
        const id = node.nid[0].value;
        const title = node.title[0].value;
        const content = node.body ? node.body[0].value : '';
        return {
            id,
            'title': { rendered: title },
            'content': { rendered: content },
        };
    }
    static nodeToMedia(node) {
        const id = node.nid[0].value;
        const title = node.title[0].value;
        const media = {
            id,
            'title': { rendered: title },
        };
        console.log(node);
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
exports.DrupalToWordpress = DrupalToWordpress;
//# sourceMappingURL=drupal-to-wordpress.js.map