import { Component, ContentChildren, QueryList } from "@angular/core";
import { TemplateIdDirective } from "../../directives/template-id.directive";

import { TemplateStorageService } from "../../services/template-storage.service";

@Component({
    selector: 'template-storage',
    template: ''
})
export class TemplateStorageComponent {
    // Fetching content templates inside template-storage component
    @ContentChildren(TemplateIdDirective)
    templatesList: QueryList<TemplateIdDirective>;

    constructor(private service: TemplateStorageService) {
        this.templatesList = new QueryList();
    }

    ngAfterViewInit() {
        const templatesArray = this.templatesList ? this.templatesList.toArray() : [];
        // Traversing templates to create mapping
        templatesArray.forEach((template) => {
            this.service.templates.set(template.templateId, template.template);
        });

    }
}