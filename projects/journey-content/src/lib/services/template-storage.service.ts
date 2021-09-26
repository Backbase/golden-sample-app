import { Injectable, TemplateRef } from "@angular/core";

@Injectable()
export class TemplateStorageService {
    templates = new Map<string, TemplateRef<any>>();
}