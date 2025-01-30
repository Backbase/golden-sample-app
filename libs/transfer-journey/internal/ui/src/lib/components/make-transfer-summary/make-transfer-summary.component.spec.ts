import '@angular/localize/init';
import { MakeTransferSummaryComponent } from './make-transfer-summary.component';
import { TransferJourneyMakeTransferSummaryTranslations } from '../../../translations-catalog';

describe('MakeTransferSummaryComponent', () => {
  let component: MakeTransferSummaryComponent;
  beforeEach(() => {
    component = new MakeTransferSummaryComponent(
      {} as TransferJourneyMakeTransferSummaryTranslations
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('should emit close', () => {
      const spy = jest.spyOn(component.closeTransfer, 'emit');
      component.close();
      expect(spy).toHaveBeenCalled();
    });
  });
  describe('close', () => {
    it('should emit close', () => {
      const spy = jest.spyOn(component.submitTransfer, 'emit');
      component.submit();
      expect(spy).toHaveBeenCalled();
    });
  });
});
