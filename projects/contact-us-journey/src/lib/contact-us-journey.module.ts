import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRoutes, Route, RouterModule } from '@angular/router';
import {
  ButtonModule,
  IconModule,
  InputValidationMessageModule,
  LoadingIndicatorModule
} from '@backbase/ui-ang';
import { TRANSLATIONS } from './constants/dynamic-translations';
import { ContactUsJourneyComponent } from './contact-us-journey.component';
import { ContactOptionsViewComponent } from './views/contact-options-view/contact-options-view.component';
import { JourneyContentModule } from 'journey-content';
import { ContactUsFormComponent } from './components/contact-us-form/contact-us-form.component';
import { EmbeddedMapComponent } from './components/embedded-map/embedded-map.component';
import { MessageSentViewComponent } from './views/message-sent-view/message-sent-view.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { SocialNetworksComponent } from './components/social-networks/social-networks.component';

const defaultRoute: Route = {
  path: '',
  component: ContactUsJourneyComponent,
  children: [
    {
      path: '',
      redirectTo: 'contact-options',
      pathMatch: 'full'
    },
    {
      path: 'contact-options',
      component: ContactOptionsViewComponent,
      data: {
        title: TRANSLATIONS.contactUsTitle,
        contactUsSectionTitle: TRANSLATIONS.contactUsSectionTitle,
        businessInfoSectionTitle: TRANSLATIONS.businessInfoSectionTitle,
        stayConnectedSectionTitle: TRANSLATIONS.stayConnectedSectionTitle
      },
    },
    {
      path: 'message-sent',
      component: MessageSentViewComponent,
      data: {
        title: TRANSLATIONS.messageSentTitle
      },
    }
  ]
};

@NgModule({
  declarations: [
    ContactUsJourneyComponent,
    ContactOptionsViewComponent,
    MessageSentViewComponent,
    ContactUsFormComponent,
    EmbeddedMapComponent,
    SocialNetworksComponent,
    SafeUrlPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    InputValidationMessageModule,
    ReactiveFormsModule,
    LoadingIndicatorModule,
    JourneyContentModule,
    IconModule,
  ],
  providers: [SafeUrlPipe],
  exports: [ ContactUsJourneyComponent, SafeUrlPipe ]
})
export class ContactUsJourneyModule {
  static forRoot(data: { [key: string]: unknown; route: Route } = { route: defaultRoute }): ModuleWithProviders<ContactUsJourneyModule> {
    return {
      ngModule: ContactUsJourneyModule,
      providers: [ provideRoutes([ data.route ]) ],
    };
  }
}
