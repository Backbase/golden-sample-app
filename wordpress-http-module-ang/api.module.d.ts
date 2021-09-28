import { ModuleWithProviders } from '@angular/core';
import { CMSConfiguration } from './configuration';
import { HttpClient } from '@angular/common/http';
import { DataModulesManager } from "@backbase/foundation-ang/data-http";
import * as ɵngcc0 from '@angular/core';
export declare class CMSApiModule {
    static forRoot(configurationFactory: () => CMSConfiguration): ModuleWithProviders<CMSApiModule>;
    constructor(parentModule: CMSApiModule, http: HttpClient, dataModulesManager: DataModulesManager | null, config: CMSConfiguration);
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<CMSApiModule, [{ optional: true; skipSelf: true; }, { optional: true; }, { optional: true; }, null]>;
    static ɵmod: ɵngcc0.ɵɵNgModuleDeclaration<CMSApiModule, never, never, never>;
    static ɵinj: ɵngcc0.ɵɵInjectorDeclaration<CMSApiModule>;
}

//# sourceMappingURL=api.module.d.ts.map