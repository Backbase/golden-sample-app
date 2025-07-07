import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AchRule } from '../../models/ach-rule';
import { AchPositivePayHttpService } from './ach-positive-pay.http.service';

describe('AchPositivePayHttpService', () => {
  let service: AchPositivePayHttpService;
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
  } as unknown as HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AchPositivePayHttpService,
        { provide: HttpClient, useValue: mockHttpClient },
      ],
    });
    service = TestBed.inject(AchPositivePayHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created and make a get', () => {
    expect(service).toBeTruthy();
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/accounts');
  });

  describe('submitAchRule', () => {
    it('should post', () => {
      service.submitAchRule({} as AchRule);
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/ach-positive-pay/rule',
        {}
      );
    });
  });
});
