import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ErrorStatusEnum } from '../make-transfer-journey-state/make-transfer-journey-state.service';
import { MakeTransferAccountHttpService } from './make-transfer-accounts.http.service';

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
      providers: [MakeTransferAccountHttpService],
    });

    service = TestBed.inject(MakeTransferAccountHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should retrieve an account', (done) => {
    service.getAccounts().subscribe((data) => {
      expect(data).toEqual(account);
      done();
    });

    const req = httpMock.expectOne(
      '/api/arrangement-manager/client-api/v2/productsummary/context/arrangements?businessFunction=Product%20Summary&resourceName=Product%20Summary&privilege=view&size=1000000'
    );
    expect(req.request.method).toBe('GET');
    req.flush(account);
  });

  it('should return error code based on error status', () => {
    const status = service.checkErrorStatus(404);
    expect(status).toBe(ErrorStatusEnum.NOT_FOUND);
  });
});
