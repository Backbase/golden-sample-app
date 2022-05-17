/*
 * Everything in here would actually live in foundation-ang, not the journey
 */
import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  Type,
  ViewContainerRef
} from "@angular/core";

export interface ExtensionComponent<ContextType> extends Partial<OnChanges & OnDestroy & OnInit> {
  set context(context: ContextType | undefined);
}

@Directive()
export abstract class ExtensionSlotDirective<ContextType>
  implements OnInit, OnDestroy, OnChanges {
  @Input() componentType: Type<ExtensionComponent<ContextType>> | undefined;
  @Input() context: ContextType | undefined;

  private componentRef: (ComponentRef<ExtensionComponent<ContextType>>) | undefined;

  constructor(
    private readonly vcRef: ViewContainerRef,
    private readonly cfr: ComponentFactoryResolver
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const componentInstance = this.componentRef?.instance;
    if (changes['context'] && componentInstance?.ngOnChanges) {
      componentInstance.context = this.context;
      componentInstance.ngOnChanges({
        context: changes['context']
      });
    }
  }

  ngOnDestroy(): void {
    this.vcRef.clear();
    this.componentRef?.destroy();
  }

  ngOnInit(): void {
    if (!this.componentType) {
      throw new Error('componentType not defined');
    }
    // In Angular 13 we don't need the ComponentFactoryResolver and can just
    // pass this.componentType directly to this.vcRef.createComponent instead
    const factory = this.cfr.resolveComponentFactory(this.componentType);
    this.componentRef = this.vcRef.createComponent(factory);
    this.componentRef.instance.context = this.context
  }
}
