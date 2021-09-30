import { ModuleWithProviders } from '@angular/core';
import { CMSConfiguration } from './configuration';
import { HttpClient } from '@angular/common/http';
import { DataModulesManager } from "@backbase/foundation-ang/data-http";
export declare class CMSApiModule {
    static forRoot(configurationFactory: () => CMSConfiguration): ModuleWithProviders<CMSApiModule>;
    constructor(parentModule: CMSApiModule, http: HttpClient, dataModulesManager: DataModulesManager | null, config: CMSConfiguration);
}
