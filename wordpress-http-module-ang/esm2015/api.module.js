import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CMSConfiguration, CONFIG_TOKEN } from './configuration';
import { HttpClient } from '@angular/common/http';
import { DataModulesManager } from "@backbase/foundation-ang/data-http";
export class CMSApiModule {
    constructor(parentModule, http, dataModulesManager, config) {
        if (parentModule) {
            throw new Error('CMSApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
                'See also https://github.com/angular/angular/issues/20575');
        }
        if (dataModulesManager) {
            dataModulesManager.setModuleConfig(CONFIG_TOKEN, {
                apiRoot: '',
                servicePath: config.basePath || '',
                headers: {},
            });
        }
    }
    static forRoot(configurationFactory) {
        return {
            ngModule: CMSApiModule,
            providers: [{ provide: CMSConfiguration, useFactory: configurationFactory }]
        };
    }
}
CMSApiModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                declarations: [],
                exports: [],
                providers: []
            },] }
];
CMSApiModule.ctorParameters = () => [
    { type: CMSApiModule, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: HttpClient, decorators: [{ type: Optional }] },
    { type: DataModulesManager, decorators: [{ type: Optional }] },
    { type: CMSConfiguration }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvdG9tYXNjb3JyYWwvcHJvamVjdHMvQmFja2Jhc2UvcmVwb3MvcGF5bWVudC1vcmRlci1wcmVzZW50YXRpb24tc3BlYy1iYWNrL3RhcmdldC9nZW5lcmF0ZWQtc291cmNlcy9vcGVuYXBpLyIsInNvdXJjZXMiOlsiYXBpLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFbEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFReEUsTUFBTSxPQUFPLFlBQVk7SUFRckIsWUFBcUMsWUFBMEIsRUFDdEMsSUFBZ0IsRUFDaEIsa0JBQTZDLEVBQ3pELE1BQXdCO1FBR2pDLElBQUksWUFBWSxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO1NBQzFGO1FBQ0QsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQStEO2dCQUMvRSwwREFBMEQsQ0FBQyxDQUFDO1NBQy9EO1FBRUQsSUFBSSxrQkFBa0IsRUFBRTtZQUNwQixrQkFBa0IsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFO2dCQUM3QyxPQUFPLEVBQUUsRUFBRTtnQkFDWCxXQUFXLEVBQUUsTUFBTSxDQUFDLFFBQVEsSUFBSSxFQUFFO2dCQUNsQyxPQUFPLEVBQUUsRUFBRTthQUNkLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQTVCTSxNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUE0QztRQUM5RCxPQUFPO1lBQ0gsUUFBUSxFQUFFLFlBQVk7WUFDdEIsU0FBUyxFQUFFLENBQUUsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixFQUFFLENBQUU7U0FDakYsQ0FBQztJQUNOLENBQUM7OztZQVpKLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQU8sRUFBRTtnQkFDaEIsWUFBWSxFQUFFLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBTyxFQUFFO2dCQUNoQixTQUFTLEVBQUssRUFBRTthQUNqQjs7O1lBU3NELFlBQVksdUJBQWpELFFBQVEsWUFBSSxRQUFRO1lBbEI3QixVQUFVLHVCQW1CRCxRQUFRO1lBakJqQixrQkFBa0IsdUJBa0JULFFBQVE7WUFyQmpCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBTa2lwU2VsZiwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENNU0NvbmZpZ3VyYXRpb24sIENPTkZJR19UT0tFTiB9IGZyb20gJy4vY29uZmlndXJhdGlvbic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBEYXRhTW9kdWxlc01hbmFnZXIgfSBmcm9tIFwiQGJhY2tiYXNlL2ZvdW5kYXRpb24tYW5nL2RhdGEtaHR0cFwiO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiAgICAgIFtdLFxuICBkZWNsYXJhdGlvbnM6IFtdLFxuICBleHBvcnRzOiAgICAgIFtdLFxuICBwcm92aWRlcnM6ICAgIFtdXG59KVxuZXhwb3J0IGNsYXNzIENNU0FwaU1vZHVsZSB7XG4gICAgcHVibGljIHN0YXRpYyBmb3JSb290KGNvbmZpZ3VyYXRpb25GYWN0b3J5OiAoKSA9PiBDTVNDb25maWd1cmF0aW9uKTogTW9kdWxlV2l0aFByb3ZpZGVyczxDTVNBcGlNb2R1bGU+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5nTW9kdWxlOiBDTVNBcGlNb2R1bGUsXG4gICAgICAgICAgICBwcm92aWRlcnM6IFsgeyBwcm92aWRlOiBDTVNDb25maWd1cmF0aW9uLCB1c2VGYWN0b3J5OiBjb25maWd1cmF0aW9uRmFjdG9yeSB9IF1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciggQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcGFyZW50TW9kdWxlOiBDTVNBcGlNb2R1bGUsXG4gICAgICAgICAgICAgICAgIEBPcHRpb25hbCgpIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgICAgICAgICAgICAgIEBPcHRpb25hbCgpIGRhdGFNb2R1bGVzTWFuYWdlcjogRGF0YU1vZHVsZXNNYW5hZ2VyIHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgY29uZmlnOiBDTVNDb25maWd1cmF0aW9uLFxuXG4gICAgICAgICkge1xuICAgICAgICBpZiAocGFyZW50TW9kdWxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NNU0FwaU1vZHVsZSBpcyBhbHJlYWR5IGxvYWRlZC4gSW1wb3J0IGluIHlvdXIgYmFzZSBBcHBNb2R1bGUgb25seS4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWh0dHApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IG5lZWQgdG8gaW1wb3J0IHRoZSBIdHRwQ2xpZW50TW9kdWxlIGluIHlvdXIgQXBwTW9kdWxlISBcXG4nICtcbiAgICAgICAgICAgICdTZWUgYWxzbyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yMDU3NScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGFNb2R1bGVzTWFuYWdlcikge1xuICAgICAgICAgICAgZGF0YU1vZHVsZXNNYW5hZ2VyLnNldE1vZHVsZUNvbmZpZyhDT05GSUdfVE9LRU4sIHtcbiAgICAgICAgICAgICAgICBhcGlSb290OiAnJyxcbiAgICAgICAgICAgICAgICBzZXJ2aWNlUGF0aDogY29uZmlnLmJhc2VQYXRoIHx8ICcnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=