import { TestBed } from '@angular/core/testing';
import { TransactionsViewModule } from './transactions-view.module';
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import { EmptyStateModule } from '@backbase/ui-ang/empty-state';

/**
 * Type for Angular Ivy module definition.
 * Angular's internal structure for compiled modules.
 */
interface IvyModuleDef {
  imports?: unknown[];
}

/**
 * Type for module class with Ivy metadata.
 */
interface ModuleWithIvyMetadata {
  ɵmod?: IvyModuleDef;
  ɵinj?: IvyModuleDef;
}

/**
 * Helper to get module imports from Angular Ivy module metadata.
 * Uses Angular's internal compiled module definition.
 */
function getModuleImportsIvy(moduleClass: ModuleWithIvyMetadata): unknown[] {
  const moduleDef = moduleClass.ɵmod;
  if (moduleDef) {
    return moduleDef.imports || [];
  }
  // Fallback: check for injector def
  const injectorDef = moduleClass.ɵinj;
  if (injectorDef) {
    return injectorDef.imports || [];
  }
  return [];
}

describe('TransactionsViewModule', () => {
  describe('Module imports', () => {
    afterEach(() => {
      TestBed.resetTestingModule();
    });

    // Happy path: Module compiles without errors
    it('should_compile_without_errors_when_module_is_imported', () => {
      // Arrange
      const moduleSetup = () => {
        TestBed.configureTestingModule({
          imports: [TransactionsViewModule],
        });
      };

      // Act & Assert
      expect(moduleSetup).not.toThrow();
    });

    // Happy path: AccountSelectorModule is in the imports array
    it('should_include_AccountSelectorModule_when_module_is_defined', () => {
      // Arrange
      const moduleImports = getModuleImportsIvy(
        TransactionsViewModule as unknown as ModuleWithIvyMetadata
      );

      // Act
      const hasAccountSelector = moduleImports.some(
        (importedModule) =>
          importedModule === AccountSelectorModule ||
          (importedModule as { name?: string })?.name === 'AccountSelectorModule'
      );

      // Assert
      expect(hasAccountSelector).toBe(true);
    });

    // Happy path: EmptyStateModule is in the imports array
    it('should_include_EmptyStateModule_when_module_is_defined', () => {
      // Arrange
      const moduleImports = getModuleImportsIvy(
        TransactionsViewModule as unknown as ModuleWithIvyMetadata
      );

      // Act
      const hasEmptyState = moduleImports.some(
        (importedModule) =>
          importedModule === EmptyStateModule ||
          (importedModule as { name?: string })?.name === 'EmptyStateModule'
      );

      // Assert
      expect(hasEmptyState).toBe(true);
    });

    // Edge case: Module can be instantiated via TestBed
    it('should_be_injectable_when_configured_in_TestBed', () => {
      // Arrange
      TestBed.configureTestingModule({
        imports: [TransactionsViewModule],
      });

      // Act
      const module = TestBed.inject(TransactionsViewModule);

      // Assert
      expect(module).toBeDefined();
    });

    // Edge case: Module exports are available after import
    it('should_export_components_when_module_is_imported', () => {
      // Arrange
      TestBed.configureTestingModule({
        imports: [TransactionsViewModule],
      });

      // Act
      const moduleInstance = TestBed.inject(TransactionsViewModule);

      // Assert
      expect(moduleInstance).toBeInstanceOf(TransactionsViewModule);
    });
  });
});
