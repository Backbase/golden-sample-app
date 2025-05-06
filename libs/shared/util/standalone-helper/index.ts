import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { ButtonModule } from '@backbase/ui-ang/button';
import { IconModule } from '@backbase/ui-ang/icon';
import { LayoutModule } from '@backbase/ui-ang/layout';
import { DropdownMenuModule } from '@backbase/ui-ang/dropdown-menu';
import { AvatarModule } from '@backbase/ui-ang/avatar';
import { LogoModule } from '@backbase/ui-ang/logo';

// Define variable to store TransactionSigningModule if available
let TransactionSigningModule: any = null;

// Attempt to dynamically load the TransactionSigningModule
(async () => {
  try {
    // Using dynamic import instead of require
    const tsModule = await import('@backbase/identity-auth/transaction-signing');
    if (tsModule && tsModule.TransactionSigningModule) {
      TransactionSigningModule = tsModule.TransactionSigningModule;
    }
  } catch (err) {
    console.warn('TransactionSigningModule not available in NgModuleImports helper');
  }
})();

/**
 * Helper module to import NgModules in standalone components.
 * Add any common NgModules here that your standalone components need.
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    EntitlementsModule,
    ButtonModule,
    IconModule,
    LayoutModule,
    DropdownMenuModule,
    AvatarModule,
    LogoModule,
    // Conditionally add TransactionSigningModule if available
    ...(TransactionSigningModule ? [TransactionSigningModule] : []),
  ],
  exports: [
    CommonModule,
    RouterModule,
    EntitlementsModule,
    ButtonModule,
    IconModule,
    LayoutModule,
    DropdownMenuModule,
    AvatarModule,
    LogoModule,
    // Conditionally export TransactionSigningModule if available
    ...(TransactionSigningModule ? [TransactionSigningModule] : []),
  ],
})
export class NgModuleImportsHelper {}

/**
 * For a component that needs to use a specific set of NgModules,
 * you can create a component-specific helper like this:
 */
export function createStandaloneComponent(component: any, additionalImports: any[] = []) {
  return {
    // Mark as standalone
    standalone: true,
    
    // Import the helper module to get access to NgModules
    imports: [NgModuleImportsHelper, ...additionalImports],
    
    // Original component properties
    ...component
  };
} 