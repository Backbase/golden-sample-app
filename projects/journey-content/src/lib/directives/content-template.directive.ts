import { Directive, Input, TemplateRef } from "@angular/core";

@Directive({
    selector: '[contentTemplate]'
})
export class ContentTemplateDirective {
    @Input('contentTemplate') journeyContent: string = ''

    constructor(public readonly template: TemplateRef<any>) { }
}