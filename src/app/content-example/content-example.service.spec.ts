import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ContentExampleService } from './content-example.service';

// Disable delay for the content request to avoid the async timeout.
describe('ContentExampleService', () => {
  let service: ContentExampleService;
  let httpMock: HttpTestingController;

  const urlToFetchSimpleContent = 'http://localhost:4200/content-from-drupal/node/1?_format=hal_json';
  const urlToFetchStructuredContent = 'http://localhost:4200/content-from-drupal/node/2?_format=hal_json';
  const urlToFetchStructuredContentWithRefs = 'http://localhost:4200/content-from-drupal/node/3?_format=hal_json';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContentExampleService],
    });

    service = TestBed.inject(ContentExampleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should do a request for a simple content example', (done: DoneFn) => {
    service.simpleContentExample$.subscribe(() => done());

    const req = httpMock.expectOne(urlToFetchSimpleContent);
    req.flush({ body: [''] });

    expect(req.request.method).toBe('GET');
  });

  it('should do a request for a structured content item', (done: DoneFn) => {
    service.structuredContentExample$.subscribe(() => done());

    const req = httpMock.expectOne(urlToFetchStructuredContent);
    req.flush({ 
      field_address_line: [{ value: 'test'}],
      field_email: [{ value: 'test'}],
      field_public: [{ value: 'test'}],
      title: [{ value: 'test'}],
      type: [{ target_id: 'business_info' }],
    });

    expect(req.request.method).toBe('GET');
  });

  describe('structured content with ref request', () => {
    const mockLinkToImage = 'link-to-image-on-drupal';
    const mockStructuredContentWithRef = { 
      title: [{ value: 'test'}],
      type: [{ target_id: 'contact_us' }],
      field_email: [{ value: 'test'}],
      field_social_net: [{ uri: 'test', title: 'some title'}],
      _embedded: {
        'link-to-image/field_social_net_img': [{
          _links: {
            self: {
              href: mockLinkToImage
            }
          }
        }]
      }
    };

    it('should get structured content and ref data', (done: DoneFn) => {
      service.structuredContentWithRefsExample$.subscribe(() => done());

      const req = httpMock.expectOne(urlToFetchStructuredContentWithRefs);
      req.flush(mockStructuredContentWithRef);

      expect(req.request.method).toBe('GET');
    });

    it('should map embedded content to the actual image link', (done: DoneFn) => {
      service.structuredContentWithRefsExample$.subscribe((receivedContactuUsData) => {
        if(receivedContactuUsData) {
          const { imageLink } = receivedContactuUsData.socialLink;
          expect(imageLink).toBe(mockLinkToImage)
        }
        done();
      });

      const req = httpMock.expectOne(urlToFetchStructuredContentWithRefs);
      req.flush(mockStructuredContentWithRef);
    })
  });

  describe('error handling', () => {
    let req: TestRequest;

    beforeEach(() => {
      service.simpleContentExample$.subscribe();
      req = httpMock.expectOne('http://localhost:4200/content-from-drupal/node/1?_format=hal_json');
    });

    it('by default isContentFetchingFailed$ is false', (done: DoneFn) => {
      req.flush({ body: [''] });

      service.isContentFetchingFailed$.subscribe(value => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('in case of error isContentFetchingFailed$ is true', (done: DoneFn) => {
      req.flush('error message', { status: 404, statusText: 'Not Found' });

      service.isContentFetchingFailed$.subscribe(value => {
        expect(value).toBeTrue();
        done();
      });
    });
  });
});
