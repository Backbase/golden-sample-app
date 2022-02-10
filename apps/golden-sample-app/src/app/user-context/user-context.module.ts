import { CommonModule } from '@angular/common';
import { LOCALE_ID, NgModule, Optional } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TemplateRegistry } from '@backbase/foundation-ang/core';
import { PAGE_CONFIG } from '@backbase/foundation-ang/web-sdk';
import { SelectContextWidgetModule } from '@backbase/select-context-widget-ang';
import { UserContextComponent } from './user-context.component';

// This is temporary solution,
// that will be removed after `@backbase/select-context-widget-ang`
// will be updated in the next release
const pageConfig = (_locale: string = '') => ({
  linkRoot: '/',
  apiRoot: '/api',
  staticResourcesRoot: document.location.origin,
  locale: _locale || 'en',
});

@NgModule({
  declarations: [UserContextComponent],
  imports: [
    CommonModule,
    SelectContextWidgetModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserContextComponent,
      },
    ]),
  ],
  providers: [
    TemplateRegistry,
    {
      provide: PAGE_CONFIG,
      useFactory: pageConfig,
      deps: [[new Optional(), LOCALE_ID]],
    },
  ],
  exports: [RouterModule],
})
export class UserContextModule {}
