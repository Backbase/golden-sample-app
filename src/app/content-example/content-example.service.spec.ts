import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ContentExampleService } from './content-example.service';

describe('ContentExampleService', () => {
  let service: ContentExampleService;
  let httpMock: HttpTestingController;

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
    service.getSimpleContentExample().subscribe(() => done());

    const urlToFetchSimpleContent = 'http://localhost:4200/content-from-drupal/node/1?_format=hal_json';
    const req = httpMock.expectOne(urlToFetchSimpleContent);
    req.flush({ body: [''] });

    expect(req.request.method).toBe('GET');
  });
});
