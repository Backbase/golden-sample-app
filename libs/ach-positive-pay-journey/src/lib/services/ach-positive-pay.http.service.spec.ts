import { AchPositivePayHttpService } from './ach-positive-pay.http.service';

describe('AchPositivePayJourneyService', () => {
  let service: AchPositivePayHttpService;
  const http: any = {
    get: jest.fn(),
    post: jest.fn(),
  };

  beforeEach(() => {
    service = new AchPositivePayHttpService(http);
  });

  it('should be created and make a get', () => {
    expect(service).toBeTruthy();
    expect(http.get).toHaveBeenCalledWith('/api/accounts');
  });

  describe('submitAchRule', () => {
    it('should post', () => {
      service.submitAchRule('rule');
      expect(http.post).toHaveBeenCalledWith(
        '/api/ach-positive-pay/rule',
        'rule'
      );
    });
  });
});
