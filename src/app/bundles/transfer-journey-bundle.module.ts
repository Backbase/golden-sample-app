import { NgModule } from "@angular/core";
import { TransferJourneyModule } from "projects/transfer-journey/src/public-api";
import { MakeTransferConfigProvider } from "../config.providers";

@NgModule({
  imports: [TransferJourneyModule.forRoot()],
  providers: [MakeTransferConfigProvider],
})
export class TransferJourneyBundleModule {}
