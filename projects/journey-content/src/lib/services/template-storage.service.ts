import { Injectable, TemplateRef } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class TemplateStorageService {
    templates = new Map<string, TemplateRef<any>>();
}