import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgModuleImportsHelper } from '@backbase/shared/util/standalone-helper';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@backbase/ui-ang/button';
import { IconModule } from '@backbase/ui-ang/icon';
import { AvatarModule } from '@backbase/ui-ang/avatar';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/**
 * Sample standalone component that can use both standalone APIs and NgModule components
 * This pattern should be used for new components in the app
 */
@Component({
  selector: 'app-sample-standalone',
  standalone: true,
  // Import both standalone components and components from NgModules
  imports: [
    // Import CommonModule directly since it's standalone-compatible
    CommonModule,

    // Import our NgModuleImportsHelper to get access to UI components and other
    // non-standalone NgModules (including TransactionSigningModule if available)
    NgModuleImportsHelper,

    // Import UI components directly as standalone
    ButtonModule,
    IconModule,
    AvatarModule,
  ],
  // Add schemas to handle any web components or unknown elements
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  template: `
    <!-- Use UI components that are imported directly -->
    <bb-avatar
      [image]="'assets/images/avatar.png'"
      [size]="'large'"
      [badge]="'premium'"
    ></bb-avatar>

    <!-- Use UI components that are imported directly -->
    <bb-button-icon>
      <bb-icon name="eye"></bb-icon>
    </bb-button-icon>

    <!-- The component can also use TransactionSigningModule functionality if available -->
    <div *ngIf="transactionSigningAvailable">
      Transaction Signing functionality is available!
    </div>
    <div *ngIf="!transactionSigningAvailable">
      Transaction Signing functionality is not available.
    </div>
  `,
})
export class SampleStandaloneComponent implements OnInit {
  transactionSigningAvailable = false;

  async ngOnInit() {
    // Check if TransactionSigningModule is available using dynamic import
    try {
      const tsModule = await import(
        '@backbase/identity-auth/transaction-signing'
      );
      this.transactionSigningAvailable = !!tsModule.TransactionSigningModule;
    } catch (err) {
      this.transactionSigningAvailable = false;
    }
  }
}
