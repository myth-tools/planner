import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Environment, ENVIRONMENT } from '@myth-tools/utils/wotr/environment';
import { Observable } from 'rxjs';
import { Suffix } from './models/dynamic-link-info';
import { DynamicLinkRequest } from './models/dynamic-link-request';
import { DynamicLinkResponse } from './models/dynamic-link-response';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private readonly url = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${this.environment.firebase.apiKey}`;

    constructor(@Inject(ENVIRONMENT) private readonly environment: Environment, private readonly http: HttpClient) {}

    /** Uses Google Dynamic Links to create a short url for the link. */
    public createDynamicLink$(link: string, suffix?: Suffix): Observable<DynamicLinkResponse> {
        const data: DynamicLinkRequest = {
            dynamicLinkInfo: {
                link,
                domainUriPrefix: this.environment.firebase.prefix
            },
            suffix: { option: suffix }
        };

        return this.http.post<DynamicLinkResponse>(this.url, data);
    }
}
