import achPositivePayBundle from './ach-positive-pay-journey-bundle';

describe('AchPositivePayJourneyBundle', () => {
  it('should provide routes for lazy loading', () => {
    expect(achPositivePayBundle).toBeDefined();
    expect(achPositivePayBundle.length).toBeGreaterThan(0);
  });
});
