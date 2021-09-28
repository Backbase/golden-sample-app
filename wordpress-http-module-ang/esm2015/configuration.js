import { InjectionToken } from '@angular/core';
export class CMSConfiguration {
    constructor(configurationParameters = {}) {
        this.apiKeys = configurationParameters.apiKeys;
        this.username = configurationParameters.username;
        this.password = configurationParameters.password;
        this.accessToken = configurationParameters.accessToken;
        this.basePath = configurationParameters.basePath;
        this.withCredentials = configurationParameters.withCredentials;
        this.encoder = configurationParameters.encoder;
        if (configurationParameters.credentials) {
            this.credentials = configurationParameters.credentials;
        }
        else {
            this.credentials = {};
        }
        // init default oauth credential
        if (!this.credentials['oauth']) {
            this.credentials['oauth'] = () => {
                return typeof this.accessToken === 'function'
                    ? this.accessToken()
                    : this.accessToken;
            };
        }
    }
    /**
     * Select the correct content-type to use for a request.
     * Uses {@link CMSConfiguration#isJsonMime} to determine the correct content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param contentTypes - the array of content types that are available for selection
     * @returns the selected content-type or <code>undefined</code> if no selection could be made.
     */
    selectHeaderContentType(contentTypes) {
        if (contentTypes.length === 0) {
            return undefined;
        }
        const type = contentTypes.find((x) => this.isJsonMime(x));
        if (type === undefined) {
            return contentTypes[0];
        }
        return type;
    }
    /**
     * Select the correct accept content-type to use for a request.
     * Uses {@link CMSConfiguration#isJsonMime} to determine the correct accept content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param accepts - the array of content types that are available for selection.
     * @returns the selected content-type or <code>undefined</code> if no selection could be made.
     */
    selectHeaderAccept(accepts) {
        if (accepts.length === 0) {
            return undefined;
        }
        const type = accepts.find((x) => this.isJsonMime(x));
        if (type === undefined) {
            return accepts[0];
        }
        return type;
    }
    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    isJsonMime(mime) {
        const jsonMime = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return mime !== null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
    }
    lookupCredential(key) {
        const value = this.credentials[key];
        return typeof value === 'function'
            ? value()
            : value;
    }
}
export const CONFIG_TOKEN = new InjectionToken('api-data-module CMSConfiguration');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvdG9tYXNjb3JyYWwvcHJvamVjdHMvQmFja2Jhc2UvcmVwb3MvcGF5bWVudC1vcmRlci1wcmVzZW50YXRpb24tc3BlYy1iYWNrL3RhcmdldC9nZW5lcmF0ZWQtc291cmNlcy9vcGVuYXBpLyIsInNvdXJjZXMiOlsiY29uZmlndXJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBa0IvQyxNQUFNLE9BQU8sZ0JBQWdCO0lBZXpCLFlBQVksMEJBQXNELEVBQUU7UUFDaEUsSUFBSSxDQUFDLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUM7UUFDL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyx1QkFBdUIsQ0FBQyxRQUFRLENBQUM7UUFDakQsSUFBSSxDQUFDLFFBQVEsR0FBRyx1QkFBdUIsQ0FBQyxRQUFRLENBQUM7UUFDakQsSUFBSSxDQUFDLFdBQVcsR0FBRyx1QkFBdUIsQ0FBQyxXQUFXLENBQUM7UUFDdkQsSUFBSSxDQUFDLFFBQVEsR0FBRyx1QkFBdUIsQ0FBQyxRQUFRLENBQUM7UUFDakQsSUFBSSxDQUFDLGVBQWUsR0FBRyx1QkFBdUIsQ0FBQyxlQUFlLENBQUM7UUFDL0QsSUFBSSxDQUFDLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUM7UUFDL0MsSUFBSSx1QkFBdUIsQ0FBQyxXQUFXLEVBQUU7WUFDckMsSUFBSSxDQUFDLFdBQVcsR0FBRyx1QkFBdUIsQ0FBQyxXQUFXLENBQUM7U0FDMUQ7YUFDSTtZQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1NBQ3pCO1FBRUQsZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFFO2dCQUM3QixPQUFPLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxVQUFVO29CQUN6QyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDcEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDM0IsQ0FBQyxDQUFDO1NBQ0w7SUFDTCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksdUJBQXVCLENBQUUsWUFBc0I7UUFDbEQsSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMzQixPQUFPLFNBQVMsQ0FBQztTQUNwQjtRQUVELE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDcEIsT0FBTyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDMUI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksa0JBQWtCLENBQUMsT0FBaUI7UUFDdkMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN0QixPQUFPLFNBQVMsQ0FBQztTQUNwQjtRQUVELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDcEIsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksVUFBVSxDQUFDLElBQVk7UUFDMUIsTUFBTSxRQUFRLEdBQVcsSUFBSSxNQUFNLENBQUMsK0RBQStELEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUcsT0FBTyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssNkJBQTZCLENBQUMsQ0FBQztJQUMxRyxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsR0FBVztRQUMvQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sT0FBTyxLQUFLLEtBQUssVUFBVTtZQUM5QixDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ1QsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFFRCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxjQUFjLENBQUMsa0NBQWtDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBQYXJhbWV0ZXJDb2RlYyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgSW5qZWN0aW9uVG9rZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBDTVNDb25maWd1cmF0aW9uUGFyYW1ldGVycyB7XG4gICAgYXBpS2V5cz86IHtbIGtleTogc3RyaW5nIF06IHN0cmluZ307XG4gICAgdXNlcm5hbWU/OiBzdHJpbmc7XG4gICAgcGFzc3dvcmQ/OiBzdHJpbmc7XG4gICAgYWNjZXNzVG9rZW4/OiBzdHJpbmcgfCAoKCkgPT4gc3RyaW5nKTtcbiAgICBiYXNlUGF0aD86IHN0cmluZztcbiAgICB3aXRoQ3JlZGVudGlhbHM/OiBib29sZWFuO1xuICAgIGVuY29kZXI/OiBIdHRwUGFyYW1ldGVyQ29kZWM7XG4gICAgLyoqXG4gICAgICogVGhlIGtleXMgYXJlIHRoZSBuYW1lcyBpbiB0aGUgc2VjdXJpdHlTY2hlbWVzIHNlY3Rpb24gb2YgdGhlIE9wZW5BUElcbiAgICAgKiBkb2N1bWVudC4gVGhleSBzaG91bGQgbWFwIHRvIHRoZSB2YWx1ZSB1c2VkIGZvciBhdXRoZW50aWNhdGlvblxuICAgICAqIG1pbnVzIGFueSBzdGFuZGFyZCBwcmVmaXhlcyBzdWNoIGFzICdCYXNpYycgb3IgJ0JlYXJlcicuXG4gICAgICovXG4gICAgY3JlZGVudGlhbHM/OiB7WyBrZXk6IHN0cmluZyBdOiBzdHJpbmcgfCAoKCkgPT4gc3RyaW5nIHwgdW5kZWZpbmVkKX07XG59XG5cbmV4cG9ydCBjbGFzcyBDTVNDb25maWd1cmF0aW9uIHtcbiAgICBhcGlLZXlzPzoge1sga2V5OiBzdHJpbmcgXTogc3RyaW5nfTtcbiAgICB1c2VybmFtZT86IHN0cmluZztcbiAgICBwYXNzd29yZD86IHN0cmluZztcbiAgICBhY2Nlc3NUb2tlbj86IHN0cmluZyB8ICgoKSA9PiBzdHJpbmcpO1xuICAgIGJhc2VQYXRoPzogc3RyaW5nO1xuICAgIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW47XG4gICAgZW5jb2Rlcj86IEh0dHBQYXJhbWV0ZXJDb2RlYztcbiAgICAvKipcbiAgICAgKiBUaGUga2V5cyBhcmUgdGhlIG5hbWVzIGluIHRoZSBzZWN1cml0eVNjaGVtZXMgc2VjdGlvbiBvZiB0aGUgT3BlbkFQSVxuICAgICAqIGRvY3VtZW50LiBUaGV5IHNob3VsZCBtYXAgdG8gdGhlIHZhbHVlIHVzZWQgZm9yIGF1dGhlbnRpY2F0aW9uXG4gICAgICogbWludXMgYW55IHN0YW5kYXJkIHByZWZpeGVzIHN1Y2ggYXMgJ0Jhc2ljJyBvciAnQmVhcmVyJy5cbiAgICAgKi9cbiAgICBjcmVkZW50aWFsczoge1sga2V5OiBzdHJpbmcgXTogc3RyaW5nIHwgKCgpID0+IHN0cmluZyB8IHVuZGVmaW5lZCl9O1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlndXJhdGlvblBhcmFtZXRlcnM6IENNU0NvbmZpZ3VyYXRpb25QYXJhbWV0ZXJzID0ge30pIHtcbiAgICAgICAgdGhpcy5hcGlLZXlzID0gY29uZmlndXJhdGlvblBhcmFtZXRlcnMuYXBpS2V5cztcbiAgICAgICAgdGhpcy51c2VybmFtZSA9IGNvbmZpZ3VyYXRpb25QYXJhbWV0ZXJzLnVzZXJuYW1lO1xuICAgICAgICB0aGlzLnBhc3N3b3JkID0gY29uZmlndXJhdGlvblBhcmFtZXRlcnMucGFzc3dvcmQ7XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBjb25maWd1cmF0aW9uUGFyYW1ldGVycy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgdGhpcy5iYXNlUGF0aCA9IGNvbmZpZ3VyYXRpb25QYXJhbWV0ZXJzLmJhc2VQYXRoO1xuICAgICAgICB0aGlzLndpdGhDcmVkZW50aWFscyA9IGNvbmZpZ3VyYXRpb25QYXJhbWV0ZXJzLndpdGhDcmVkZW50aWFscztcbiAgICAgICAgdGhpcy5lbmNvZGVyID0gY29uZmlndXJhdGlvblBhcmFtZXRlcnMuZW5jb2RlcjtcbiAgICAgICAgaWYgKGNvbmZpZ3VyYXRpb25QYXJhbWV0ZXJzLmNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWRlbnRpYWxzID0gY29uZmlndXJhdGlvblBhcmFtZXRlcnMuY3JlZGVudGlhbHM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWRlbnRpYWxzID0ge307XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbml0IGRlZmF1bHQgb2F1dGggY3JlZGVudGlhbFxuICAgICAgICBpZiAoIXRoaXMuY3JlZGVudGlhbHNbJ29hdXRoJ10pIHtcbiAgICAgICAgICAgIHRoaXMuY3JlZGVudGlhbHNbJ29hdXRoJ10gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmFjY2Vzc1Rva2VuID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5hY2Nlc3NUb2tlbigpXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3QgdGhlIGNvcnJlY3QgY29udGVudC10eXBlIHRvIHVzZSBmb3IgYSByZXF1ZXN0LlxuICAgICAqIFVzZXMge0BsaW5rIENNU0NvbmZpZ3VyYXRpb24jaXNKc29uTWltZX0gdG8gZGV0ZXJtaW5lIHRoZSBjb3JyZWN0IGNvbnRlbnQtdHlwZS5cbiAgICAgKiBJZiBubyBjb250ZW50IHR5cGUgaXMgZm91bmQgcmV0dXJuIHRoZSBmaXJzdCBmb3VuZCB0eXBlIGlmIHRoZSBjb250ZW50VHlwZXMgaXMgbm90IGVtcHR5XG4gICAgICogQHBhcmFtIGNvbnRlbnRUeXBlcyAtIHRoZSBhcnJheSBvZiBjb250ZW50IHR5cGVzIHRoYXQgYXJlIGF2YWlsYWJsZSBmb3Igc2VsZWN0aW9uXG4gICAgICogQHJldHVybnMgdGhlIHNlbGVjdGVkIGNvbnRlbnQtdHlwZSBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIG5vIHNlbGVjdGlvbiBjb3VsZCBiZSBtYWRlLlxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RIZWFkZXJDb250ZW50VHlwZSAoY29udGVudFR5cGVzOiBzdHJpbmdbXSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmIChjb250ZW50VHlwZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHlwZSA9IGNvbnRlbnRUeXBlcy5maW5kKCh4OiBzdHJpbmcpID0+IHRoaXMuaXNKc29uTWltZSh4KSk7XG4gICAgICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50VHlwZXNbMF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VsZWN0IHRoZSBjb3JyZWN0IGFjY2VwdCBjb250ZW50LXR5cGUgdG8gdXNlIGZvciBhIHJlcXVlc3QuXG4gICAgICogVXNlcyB7QGxpbmsgQ01TQ29uZmlndXJhdGlvbiNpc0pzb25NaW1lfSB0byBkZXRlcm1pbmUgdGhlIGNvcnJlY3QgYWNjZXB0IGNvbnRlbnQtdHlwZS5cbiAgICAgKiBJZiBubyBjb250ZW50IHR5cGUgaXMgZm91bmQgcmV0dXJuIHRoZSBmaXJzdCBmb3VuZCB0eXBlIGlmIHRoZSBjb250ZW50VHlwZXMgaXMgbm90IGVtcHR5XG4gICAgICogQHBhcmFtIGFjY2VwdHMgLSB0aGUgYXJyYXkgb2YgY29udGVudCB0eXBlcyB0aGF0IGFyZSBhdmFpbGFibGUgZm9yIHNlbGVjdGlvbi5cbiAgICAgKiBAcmV0dXJucyB0aGUgc2VsZWN0ZWQgY29udGVudC10eXBlIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgbm8gc2VsZWN0aW9uIGNvdWxkIGJlIG1hZGUuXG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdEhlYWRlckFjY2VwdChhY2NlcHRzOiBzdHJpbmdbXSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmIChhY2NlcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHR5cGUgPSBhY2NlcHRzLmZpbmQoKHg6IHN0cmluZykgPT4gdGhpcy5pc0pzb25NaW1lKHgpKTtcbiAgICAgICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGFjY2VwdHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIE1JTUUgaXMgYSBKU09OIE1JTUUuXG4gICAgICogSlNPTiBNSU1FIGV4YW1wbGVzOlxuICAgICAqICAgYXBwbGljYXRpb24vanNvblxuICAgICAqICAgYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEY4XG4gICAgICogICBBUFBMSUNBVElPTi9KU09OXG4gICAgICogICBhcHBsaWNhdGlvbi92bmQuY29tcGFueStqc29uXG4gICAgICogQHBhcmFtIG1pbWUgLSBNSU1FIChNdWx0aXB1cnBvc2UgSW50ZXJuZXQgTWFpbCBFeHRlbnNpb25zKVxuICAgICAqIEByZXR1cm4gVHJ1ZSBpZiB0aGUgZ2l2ZW4gTUlNRSBpcyBKU09OLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHVibGljIGlzSnNvbk1pbWUobWltZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGpzb25NaW1lOiBSZWdFeHAgPSBuZXcgUmVnRXhwKCdeKGFwcGxpY2F0aW9uXFwvanNvbnxbXjsvIFxcdF0rXFwvW147LyBcXHRdK1srXWpzb24pWyBcXHRdKig7LiopPyQnLCAnaScpO1xuICAgICAgICByZXR1cm4gbWltZSAhPT0gbnVsbCAmJiAoanNvbk1pbWUudGVzdChtaW1lKSB8fCBtaW1lLnRvTG93ZXJDYXNlKCkgPT09ICdhcHBsaWNhdGlvbi9qc29uLXBhdGNoK2pzb24nKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9va3VwQ3JlZGVudGlhbChrZXk6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jcmVkZW50aWFsc1trZXldO1xuICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICA/IHZhbHVlKClcbiAgICAgICAgICAgIDogdmFsdWU7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgQ09ORklHX1RPS0VOID0gbmV3IEluamVjdGlvblRva2VuKCdhcGktZGF0YS1tb2R1bGUgQ01TQ29uZmlndXJhdGlvbicpO1xuXG4iXX0=