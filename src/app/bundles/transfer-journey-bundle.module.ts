import { NgModule } from "@angular/core";
import { TransferJourneyModule } from "transfer-journey";
import { MakeTransferConfigProvider } from "../config.providers";

@NgModule({
  imports: [TransferJourneyModule.forRoot()],
  providers: [MakeTransferConfigProvider],
})
export class TransferJourneyBundleModule {}
