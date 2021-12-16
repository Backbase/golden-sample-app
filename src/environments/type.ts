import { Provider } from "@angular/core";

export interface Environment {
	production: boolean,
	apiRoot: string,
	mockProviders: Provider[],
	locales: string[],
}