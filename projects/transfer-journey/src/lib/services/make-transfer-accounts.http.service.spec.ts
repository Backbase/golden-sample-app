import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MakeTransferAccountHttpService } from "transfer-journey";

describe('MakeTransferAccountHttpService', () => {
  let httpMock: HttpTestingController;
  let service: MakeTransferAccountHttpService;
  const account = {
    id: '00001',
    name: 'my account name',
    amount: 5690.76,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MakeTransferAccountHttpService]
    });
    
    service = TestBed.inject(MakeTransferAccountHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should retrieve an account', (done) => {
    service.currentAccount$.subscribe((data) => {
      expect(data).toEqual(account);
      done();
    });

    const req = httpMock.expectOne('/api/accounts/current');
    expect(req.request.method).toBe('GET');
    req.flush(account);
  });
});