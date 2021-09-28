import { Directive, Input, TemplateRef } from "@angular/core";

@Directive({
    selector: '[templateId]'
})
export class TemplateIdDirective {
    @Input('templateId') 
    templateId: string = '';

    constructor(public readonly template: TemplateRef<any>) { }
}