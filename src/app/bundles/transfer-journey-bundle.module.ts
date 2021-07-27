import { NgModule } from "@angular/core";
import { TransferJourneyModule } from "projects/transfer-journey/src/public-api";

@NgModule({
  imports: [TransferJourneyModule.forRoot()]
})
export class TransferJourneyBundleModule {}
