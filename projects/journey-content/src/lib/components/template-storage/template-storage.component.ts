import { Component, ContentChildren, QueryList } from "@angular/core";
import { ContentTemplateDirective } from "../../directives/content-template.directive";

import { TemplateStorageService } from "../../services/template-storage.service";

@Component({
    selector: 'template-storage',
    template: ''
})
export class TemplateStorageComponent {
    // Fetching content templates inside template-storage component
    @ContentChildren(ContentTemplateDirective)
    templatesList: QueryList<ContentTemplateDirective> | undefined;

    constructor(private service: TemplateStorageService) {}

    ngAfterViewInit() {
        const templatesArray = this.templatesList ? this.templatesList.toArray() : [];
        // Traversing templates to create mapping
        templatesArray.forEach((template) => {
            this.service.templates.set(template.journeyContent, template.template);
        });
    }
}