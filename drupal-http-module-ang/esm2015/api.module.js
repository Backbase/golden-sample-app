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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvdG9tYXNjb3JyYWwvZ29sZGVuLXNhbXBsZS1hcHAvZHJ1cGFsLXNwZWMvdGFyZ2V0L2dlbmVyYXRlZC1zb3VyY2VzL29wZW5hcGkvIiwic291cmNlcyI6WyJhcGkubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQXVCLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVsRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQVF4RSxNQUFNLE9BQU8sWUFBWTtJQVFyQixZQUFxQyxZQUEwQixFQUN0QyxJQUFnQixFQUNoQixrQkFBNkMsRUFDekQsTUFBd0I7UUFHakMsSUFBSSxZQUFZLEVBQUU7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHFFQUFxRSxDQUFDLENBQUM7U0FDMUY7UUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsTUFBTSxJQUFJLEtBQUssQ0FBQywrREFBK0Q7Z0JBQy9FLDBEQUEwRCxDQUFDLENBQUM7U0FDL0Q7UUFFRCxJQUFJLGtCQUFrQixFQUFFO1lBQ3BCLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUU7Z0JBQzdDLE9BQU8sRUFBRSxFQUFFO2dCQUNYLFdBQVcsRUFBRSxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUU7Z0JBQ2xDLE9BQU8sRUFBRSxFQUFFO2FBQ2QsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBNUJNLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0JBQTRDO1FBQzlELE9BQU87WUFDSCxRQUFRLEVBQUUsWUFBWTtZQUN0QixTQUFTLEVBQUUsQ0FBRSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsb0JBQW9CLEVBQUUsQ0FBRTtTQUNqRixDQUFDO0lBQ04sQ0FBQzs7O1lBWkosUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBTyxFQUFFO2dCQUNoQixZQUFZLEVBQUUsRUFBRTtnQkFDaEIsT0FBTyxFQUFPLEVBQUU7Z0JBQ2hCLFNBQVMsRUFBSyxFQUFFO2FBQ2pCOzs7WUFTc0QsWUFBWSx1QkFBakQsUUFBUSxZQUFJLFFBQVE7WUFsQjdCLFVBQVUsdUJBbUJELFFBQVE7WUFqQmpCLGtCQUFrQix1QkFrQlQsUUFBUTtZQXJCakIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMsIFNraXBTZWxmLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ01TQ29uZmlndXJhdGlvbiwgQ09ORklHX1RPS0VOIH0gZnJvbSAnLi9jb25maWd1cmF0aW9uJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IERhdGFNb2R1bGVzTWFuYWdlciB9IGZyb20gXCJAYmFja2Jhc2UvZm91bmRhdGlvbi1hbmcvZGF0YS1odHRwXCI7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6ICAgICAgW10sXG4gIGRlY2xhcmF0aW9uczogW10sXG4gIGV4cG9ydHM6ICAgICAgW10sXG4gIHByb3ZpZGVyczogICAgW11cbn0pXG5leHBvcnQgY2xhc3MgQ01TQXBpTW9kdWxlIHtcbiAgICBwdWJsaWMgc3RhdGljIGZvclJvb3QoY29uZmlndXJhdGlvbkZhY3Rvcnk6ICgpID0+IENNU0NvbmZpZ3VyYXRpb24pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPENNU0FwaU1vZHVsZT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmdNb2R1bGU6IENNU0FwaU1vZHVsZSxcbiAgICAgICAgICAgIHByb3ZpZGVyczogWyB7IHByb3ZpZGU6IENNU0NvbmZpZ3VyYXRpb24sIHVzZUZhY3Rvcnk6IGNvbmZpZ3VyYXRpb25GYWN0b3J5IH0gXVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKCBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwYXJlbnRNb2R1bGU6IENNU0FwaU1vZHVsZSxcbiAgICAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgaHR0cDogSHR0cENsaWVudCxcbiAgICAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgZGF0YU1vZHVsZXNNYW5hZ2VyOiBEYXRhTW9kdWxlc01hbmFnZXIgfCBudWxsLFxuICAgICAgICAgICAgICAgICBjb25maWc6IENNU0NvbmZpZ3VyYXRpb24sXG5cbiAgICAgICAgKSB7XG4gICAgICAgIGlmIChwYXJlbnRNb2R1bGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ01TQXBpTW9kdWxlIGlzIGFscmVhZHkgbG9hZGVkLiBJbXBvcnQgaW4geW91ciBiYXNlIEFwcE1vZHVsZSBvbmx5LicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaHR0cCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbmVlZCB0byBpbXBvcnQgdGhlIEh0dHBDbGllbnRNb2R1bGUgaW4geW91ciBBcHBNb2R1bGUhIFxcbicgK1xuICAgICAgICAgICAgJ1NlZSBhbHNvIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIwNTc1Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YU1vZHVsZXNNYW5hZ2VyKSB7XG4gICAgICAgICAgICBkYXRhTW9kdWxlc01hbmFnZXIuc2V0TW9kdWxlQ29uZmlnKENPTkZJR19UT0tFTiwge1xuICAgICAgICAgICAgICAgIGFwaVJvb3Q6ICcnLFxuICAgICAgICAgICAgICAgIHNlcnZpY2VQYXRoOiBjb25maWcuYmFzZVBhdGggfHwgJycsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==