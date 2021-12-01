import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ContentExampleService } from './content-example.service';

describe('ContentExampleService', () => {
  let service: ContentExampleService;
  let httpMock: HttpTestingController;

  const urlToFetchSimpleContent = 'http://localhost:4200/content-from-drupal/node/1?_format=hal_json';

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
