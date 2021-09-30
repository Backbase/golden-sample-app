import { Post } from '../interfaces/cms-post';
import { Media } from '../interfaces/cms-media';
import { NodeArticle, NodeImage } from 'drupal-http-module-ang';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DrupalToWordpress {
    static nodeToPost(node$: Observable<NodeArticle>): Observable<Post> {
        return node$
        .pipe(
            map((node: NodeArticle): Post => {
                const id = node.nid[0].value;
                const title = node.title[0].value;
                const content = node['body'] ? node.body[0].value : '';
                
                return {
                    id,
                    'title': { rendered: title },
                    'content': { rendered: content },
                };
            })
        );
    }

    static nodeToMedia(node$: Observable<NodeImage>): Observable<Media> {
        return node$
        .pipe(
            map((node: NodeImage): Media => {
                console.log(node);
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
            })
        );
    }
}

